/* ============================================================
   LESNOY · Сид данных · Июнь 2026
   Источник цифр — утверждённый макет (maket.html).
   Правила:
   - null = «нет данных» (в интерфейсе показывается «—»)
   - всё, что считается автоматически, здесь НЕ хранится:
     прирост (подписки − отписки), цена подписчика, цена заказа,
     проценты отзывов, итоги PR, вся вкладка «Сводка» (кроме выводов)
   - бюджеты таргета — в долларах США (число, без знака $)
   - PR и доставка — в местной валюте города (поле currency)
   ============================================================ */

const SEED = {
  "2026-06": {

    cities: {

      /* ==================== ТАШКЕНТ ==================== */
      tas: {
        name: "Ташкент",
        currency: "сум",

        /* ---- СММ — Instagram ---- */
        smm: {
          followers: 19215,        // подписчики на конец месяца
          follows: 2933,           // подписки за месяц
          unfollows: 672,          // отписки за месяц
          growthPct: 13.0,         // прирост в % (из статистики Instagram)
          views: 4154229,          // просмотры
          viewsAdsPct: 89.9,       // % просмотров от рекламы
          reached: 1571255,        // охваченные аккаунты
          reachedDeltaPct: 116.4,  // динамика охвата, %
          viewsFollowersPct: 2.5,  // доля просмотров от подписчиков, %
          storiesPct: 62.7         // доля историй в просмотрах, %
        },

        /* ---- PR · Блогеры ---- */
        /* { hashtag, reach, amount } · данных за июнь нет — пустой список */
        pr: [],

        /* ---- Таргетированная реклама · Instagram ---- */
        target: {
          /* итоги — вводятся редактором отдельно из кабинета
             (охват НЕ равен сумме строк из-за пересечения аудиторий) */
          meta: {
            budget: 891.14,
            reach: 1503686,
            impressions: 3601236,
            clicks: 20381,
            subs: 1885,
            visits: null           // визиты профиля — данных за июнь нет
          },
          campaigns: [
            { name: "Traffic Instagram", tag: "",
              budget: 584.25, reach: 475048, impressions: 982385,
              clicks: 19361, subs: 1845, visits: null },
            { name: "AWR", tag: "Охватная",
              budget: 211.41, reach: 1149947, impressions: 2571950,
              clicks: 590, subs: 10, visits: null },
            { name: "Direct message", tag: "",
              budget: 85.17, reach: 13437, impressions: null,
              clicks: null, subs: 28, visits: null },
            { name: "Conversion — 2", tag: "",
              budget: 8.00, reach: null, impressions: null,
              clicks: null, subs: null, visits: null },
            { name: "Conversion", tag: "",
              budget: 2.31, reach: null, impressions: null,
              clicks: null, subs: null, visits: null }
          ]
        },

        /* ---- Доставка · Яндекс Еда CPA (блок опциональный) ---- */
        delivery: {
          period: "27.06 — 03.07",  // период продвижения
          views: 3919,
          clicks: 169,
          orders: 19,
          revenue: 4066000,          // выручка от продвижения
          costs: 502194,             // затраты на продвижение
          promoRevenuePct: 73.3      // доля выручки от продвижения во всей выручке доставки, %
        },

        /* ---- Отзывы гостей ---- */
        reviews: {
          total: 14,
          positive: 11,
          negative: 3,
          avgRating: 4.3,            // средняя оценка (null — если нет)
          note: "Обе «единицы» — претензии к блюдам, не к сервису. Один отзыв на 3★."
        }
      },

      /* ==================== БИШКЕК ==================== */
      bis: {
        name: "Бишкек",
        currency: "сом",

        smm: {
          followers: 21617,
          follows: 890,
          unfollows: 324,
          growthPct: 2.6,
          views: 1222290,
          viewsAdsPct: 80.3,
          reached: 391013,
          reachedDeltaPct: 399.1,
          viewsFollowersPct: 5.0,
          storiesPct: 77.1
        },

        pr: [],

        target: {
          meta: {
            budget: 359.31,
            reach: 377670,
            impressions: 910589,
            clicks: null,
            subs: 440,
            visits: 8211
          },
          campaigns: [
            { name: "Traffic Instagram", tag: "",
              budget: 213.91, reach: 144140, impressions: 314686,
              clicks: null, subs: 409, visits: 6466 },
            { name: "Message", tag: "",
              budget: 69.69, reach: 21738, impressions: 46237,
              clicks: null, subs: 15, visits: null },
            { name: "Шум леса среди города", tag: "Имиджевая · оценка по охвату",
              budget: 49.06, reach: 239519, impressions: 539027,
              clicks: null, subs: 9, visits: null },
            { name: "Изысканные вечера", tag: "",
              budget: 26.65, reach: null, impressions: 10639,
              clicks: null, subs: 7, visits: null }
          ]
        },

        /* доставки в Бишкеке нет — блок отсутствует */
        delivery: null,

        reviews: {
          total: 34,
          positive: 30,
          negative: 4,
          avgRating: null,
          note: ""
        }
      }
    },

    /* ==================== ВЫВОДЫ МЕСЯЦА (пишутся руками) ==================== */
    /* city: 'tas' | 'bis' | '' (без города) · tone: 'win' | 'warn' | '' (нейтрально) */
    findings: [
      { city: "tas", tone: "win",
        title: "Таргет работает эффективно.",
        text: "Подписчик по $0,32 в кампании Traffic Instagram — сильный результат; кампания дала 98% всех подписок из рекламы." },
      { city: "tas", tone: "warn",
        title: "Рост держится на рекламе.",
        text: "89,9% просмотров — рекламные, 97,5% аудитории просмотров — неподписчики. Плюс 672 отписки на 2 933 подписки (каждый четвёртый уходит). Органика и удержание — зона роста для контента." },
      { city: "tas", tone: "warn",
        title: "Негатив — только про кухню.",
        text: "Оба отзыва на 1★ касаются блюд, не сервиса и не атмосферы. Стоит передать на разбор кухне вместе с текущей переработкой меню." },
      { city: "tas", tone: "win",
        title: "Яндекс Еда CPA окупается.",
        text: "ДРР 12,35% при конверсии в заказ 11,2%. Но канал уже даёт 73% выручки доставки — зависимость от платного продвижения высокая." },
      { city: "bis", tone: "",
        title: "Подписчик дороже, зато лояльность выше.",
        text: "$0,82 против $0,47 в Ташкенте — при этом 88% позитивных отзывов и рост охвата +399%. Имиджевая кампания «Шум леса среди города» дала 240 тыс. охвата, но всего 9 подписок — оценивать её стоит по охвату, не по подпискам." }
    ]
  }
};
