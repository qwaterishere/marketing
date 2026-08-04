-- ============================================================
-- LESNOY · Маркетинговый отчёт · Схема Supabase
-- Запускать целиком в Supabase SQL Editor (проект → SQL Editor → New query).
-- Скрипт идемпотентный: повторный запуск ничего не сломает.
-- ============================================================

-- ---------- Таблица отчётов: один месяц = одна строка ----------
create table if not exists public.reports (
  month text primary key,              -- '2026-06'
  data jsonb not null,                 -- весь месяц одним JSON
  updated_at timestamptz default now()
);

-- ---------- Роли пользователей ----------
-- Нет строки = роль «просмотр» (по умолчанию, в т.ч. без входа)
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('editor', 'superuser'))
);

alter table public.reports enable row level security;
alter table public.user_roles enable row level security;

-- ---------- Функция проверки роли ----------
-- security definer: читает user_roles в обход RLS,
-- поэтому политики на user_roles не зацикливаются сами на себя
create or replace function public.get_my_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.user_roles where user_id = auth.uid()
$$;

-- ---------- Политики: reports ----------
-- Читают все, включая анонимов (публичная ссылка)
drop policy if exists "reports_read_all" on public.reports;
create policy "reports_read_all" on public.reports
  for select using (true);

-- Создание месяца: только редактор и суперюзер
drop policy if exists "reports_insert_editors" on public.reports;
create policy "reports_insert_editors" on public.reports
  for insert with check (public.get_my_role() in ('editor', 'superuser'));

-- Изменение месяца: только редактор и суперюзер
drop policy if exists "reports_update_editors" on public.reports;
create policy "reports_update_editors" on public.reports
  for update using (public.get_my_role() in ('editor', 'superuser'))
  with check (public.get_my_role() in ('editor', 'superuser'));

-- Удаление месяца: только редактор и суперюзер
drop policy if exists "reports_delete_editors" on public.reports;
create policy "reports_delete_editors" on public.reports
  for delete using (public.get_my_role() in ('editor', 'superuser'));

-- ---------- Политики: user_roles ----------
-- Свою роль видит каждый вошедший; суперюзер видит все
drop policy if exists "roles_read" on public.user_roles;
create policy "roles_read" on public.user_roles
  for select using (user_id = auth.uid() or public.get_my_role() = 'superuser');

-- Назначать и менять роли может только суперюзер
drop policy if exists "roles_write_superuser" on public.user_roles;
create policy "roles_write_superuser" on public.user_roles
  for all using (public.get_my_role() = 'superuser')
  with check (public.get_my_role() = 'superuser');

-- ---------- Автообновление updated_at ----------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists reports_touch on public.reports;
create trigger reports_touch
  before update on public.reports
  for each row execute function public.touch_updated_at();

-- ---------- Список пользователей для суперюзера ----------
-- auth.users по API недоступна, поэтому суперюзеру нужен такой мост.
-- Проверка роли — внутри функции: для всех остальных вернёт пусто.
create or replace function public.list_users()
returns table (user_id uuid, email text, role text)
language sql
security definer
set search_path = public
stable
as $$
  select u.id, u.email::text, r.role
  from auth.users u
  left join public.user_roles r on r.user_id = u.id
  where public.get_my_role() = 'superuser'
  order by u.created_at
$$;

-- ============================================================
-- ПЕРВЫЙ СУПЕРЮЗЕР (выполнить ОДИН раз, отдельно, после того как
-- ты зарегистрируешься в приложении со своим email):
--
-- insert into public.user_roles (user_id, role)
-- select id, 'superuser' from auth.users where email = 'specialforgras@gmail.com'
-- on conflict (user_id) do update set role = 'superuser';
-- ============================================================
