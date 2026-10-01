/*
 * Единый источник данных для сайта (index.html) и PDF-документов (print/*.html).
 * Правьте текст только здесь — затем `npm run pdf`, чтобы пересобрать PDF.
 *
 * Правила:
 *  - shared  — то, что не зависит от языка (ссылки, файлы, контакты, медиа).
 *  - ru / en — тексты. Ключи в обоих языках должны совпадать.
 *  - null в полях one-pager = данные ещё не заданы: на сайте поле скрыто,
 *    в PDF выводится заметная метка [TODO], а `npm run pdf` выводит список пропусков.
 *  - url: '' у ссылки = ссылка ещё не задана: на сайте скрыта, появится после заполнения.
 */
window.CONTENT = {
  shared: {
    // Инструменты: отдельный раздел логотипов после «Опыта»; icon — ключ из assets/js/tool-icons.js
    tools: [
      { name: 'Unity 6', icon: 'unity' },
      { name: 'C#', icon: 'csharp' },
      { name: 'Blender', icon: 'blender' },
      { name: 'GitHub', icon: 'github' },
      { name: 'Trello', icon: 'trello' },
      { name: 'Claude Code', icon: 'claudecode' },
    ],
    avatar: 'assets/img/icons/avatar.webp', // аватар в шапке сайта
    contacts: {
      telegram: 'https://t.me/NEON_ner',
      telegramHandle: '@NEON_ner',
      email: '',                 // TODO: добавить e-mail (сайт покажет его автоматически)
      site: '',                  // TODO: адрес сайта после публикации (попадёт в PDF), напр. 'boldyrev.dev'
    },
    files: {
      cv: { ru: 'cv/Boldyrev_CV_RU.pdf', en: 'cv/Boldyrev_CV_EN.pdf' },
      onepager: { ru: 'cv/XABAR_OnePager_RU.pdf', en: 'cv/XABAR_OnePager_EN.pdf' },
    },
    projects: {
      xabar: {
        icon: 'assets/img/icons/xabar.webp', // квадратное изображение, отображается кругом/плиткой 52px
        period: { from: '2026-01', to: null },
        // Ссылки: type — site | vk | telegram | steam | rustore | community | youtube
        links: [
          { type: 'site', url: '' },     // TODO: сайт XABAR
          { type: 'telegram', url: 'https://t.me/habargameofficial' },
          { type: 'vk', url: 'https://vk.ru/habargameofficial' },
        ],
        // Скриншоты 16:9, WebP/JPG до ~300 КБ. Новые добавлять сюда (02.webp, 03.webp…) — миниатюры появятся автоматически.
        shots: [
          'assets/img/projects/xabar/01.webp',
        ],
        video: '', // ссылка на YouTube/VK Видео — блок видео появится автоматически
      },
      socd: {
        icon: 'assets/img/icons/socd.webp',
        period: { from: '2022-08', to: '2025-10' },
        links: [
          // Ссылки на RuStore нет: SOC_D больше недоступен для скачивания.
          { type: 'community', url: '' }, // TODO: сообщество SOC_D
        ],
        shots: [
          'assets/img/projects/socd/01.webp',
        ],
        video: '',
      },
    },
  },

  ru: {
    meta: {
      title: 'Юрий Болдырев — Unity-разработчик · гейм-дизайнер',
      description: 'Unity-разработчик и гейм-дизайнер, 7+ лет в геймдеве, основатель XABAR. Собираю команду для XABAR — кроссплатформенного иммерсивного шутера.',
    },
    ui: {
      nav: { projects: 'Проекты', skills: 'Навыки', path: 'Опыт', collab: 'Сотрудничество', contact: 'Контакты' },
      downloadCv: 'Резюме (PDF)',
      downloadOnepager: 'One-pager (PDF)',
      writeTelegram: 'Написать в Telegram',
      themeToggle: 'Сменить тему',
      langToggle: 'Switch to English',
      status: { dev: 'В разработке', done: 'Завершён' },
      present: 'н.в.',
      role: 'Роль',
      results: 'Результаты',
      screenshots: 'Скриншоты',
      video: 'Видео',
      lookingFor: 'Ищу в команду',
      stackLabel: 'Стек',
      rolesLabel: 'Роли',
      tools: 'Инструменты',
      close: 'Закрыть',
      prev: 'Назад',
      next: 'Вперёд',
      linkTypes: { site: 'Сайт проекта', vk: 'VK', telegram: 'Telegram', steam: 'Steam', rustore: 'RuStore', community: 'Сообщество', youtube: 'YouTube' },
      footer: 'Сайт обновляется вместе с проектом.',
      months: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    },
    person: {
      name: 'Юрий Болдырев',
      fullName: 'Болдырев Юрий Витальевич',
      initials: 'ЮБ',
      role: 'Unity-разработчик · гейм-дизайнер',
      location: 'Москва',
      tagline: 'Собираю команду для XABAR — кроссплатформенного иммерсивного шутера о постапокалипсисе. За плечами 7+ лет в геймдеве и мобильный порт S.T.A.L.K.E.R. со 100 000+ скачиваний.',
      summary: 'Unity-разработчик и гейм-дизайнер с 7+ годами в геймдеве. Прошёл путь от моддинга до полного цикла разработки: программирование и портирование движка, оптимизация под мобильные устройства, левел-дизайн и UI, руководство QA и сообществом, продвижение. Один из разработчиков SOC_D — мобильного фан-порта S.T.A.L.K.E.R. (100 000+ скачиваний, ТОП-2 шутеров RuStore в 2025 году). Сейчас — основатель и руководитель авторского проекта XABAR, формирую команду.',
    },
    // href — куда плавно прокручивает клик по плашке (подтверждение цифры)
    stats: [
      { value: '7+', label: 'лет в геймдеве', href: '#path' },
      { value: '100 000+', label: 'скачиваний SOC_D', href: '#project-socd' },
      { value: '3 млн+', label: 'просмотров о SOC_D', href: '#project-socd' },
      { value: '3 победы', label: 'на геймджемах и бизнес-тренинге', href: '#achievements' },
    ],
    projects: {
      xabar: {
        title: 'XABAR',
        kind: 'Авторский проект',
        tagline: 'Кроссплатформенный иммерсивный шутер от первого лица в постапокалипсисе — одиночная игра и мультиплеер.',
        role: 'Основатель и руководитель проекта: геймдизайн, разработка, SMM, QA',
        bullets: [
          'Определяю концепцию, геймдизайн и роадмап проекта.',
          'Формирую и координирую команду, выстраиваю процессы разработки и тестирования.',
          'Веду продвижение и сообщество проекта с ранних этапов.',
        ],
        metrics: [],
        stack: ['Unity 6', 'C#', 'Git / GitHub', 'Blender', 'Trello'],
        roles: ['Руководитель проекта', 'Гейм-дизайнер', 'Программист', 'DevOps', '3D-моделлер', 'QA', 'SMM'],
      },
      socd: {
        title: 'SOC_D',
        kind: 'Некоммерческий фанатский проект',
        tagline: 'Порт S.T.A.L.K.E.R. на мобильные устройства: перенос с движка X-Ray на Unity, с C++ на C#.',
        role: 'Разработчик; тимлид администрации проекта и отдела QA',
        bullets: [
          'Программирование и портирование логики игры с C++ (X-Ray) на C# (Unity).',
          'Оптимизация под мобильные устройства, левел-дизайн, UI.',
          'Руководство администрацией проекта: чаты, SMM, работа с сообществом.',
          'Руководство отделом QA: организация тестирования и контроль качества сборок.',
        ],
        metrics: [
          { value: '100 000+', label: 'скачиваний' },
          { value: '3 млн+', label: 'просмотров за 9 месяцев' },
          { value: 'ТОП-2', label: 'в категории «Шутеры» RuStore, 2025' },
        ],
        stack: ['Unity', 'C#', 'C++ (X-Ray)', 'Trello'],
        roles: ['Программист', 'DevOps', 'Левел-дизайнер', 'UI-дизайнер', 'Тимлид QA', 'Тимлид администрации и SMM'],
        note: 'Независимый некоммерческий фан-проект. Не связан с правообладателем S.T.A.L.K.E.R. и не получал от него поддержки. Работа завершена в октябре 2025 года.',
      },
    },
    // Навыки по областям; порядок внутри группы — от сильных к остальным.
    // Подтверждение навыков — в карточках проектов (projects.<id>.stack / roles) и достижениях (achievements[].stack).
    skills: [
      {
        title: 'Разработка',
        items: [
          { name: 'Программирование игровой логики' },
          { name: 'Оптимизация под мобильные' },
          { name: 'DevOps: сборки, CI/CD, публикация' },
          { name: '3D-моделирование' },
        ],
      },
      {
        title: 'Геймдизайн и продукт',
        items: [
          { name: 'Геймдизайн, диздок' },
          { name: 'Левел-дизайн' },
          { name: 'UI / UX' },
          { name: 'Роадмап' },
          { name: 'Lean Canvas' },
        ],
      },
      {
        title: 'Руководство и сообщество',
        items: [
          { name: 'Руководство разработкой' },
          { name: 'QA: процессы и тестирование' },
          { name: 'Управление сообществом' },
          { name: 'SMM' },
          { name: 'Публикация в RuStore' },
        ],
      },
    ],
    timeline: [
      { period: '2026 — н.в.', title: 'XABAR', text: 'Основатель и руководитель авторского шутера.' },
      { period: '2022 — 2025', title: 'SOC_D', text: 'Разработчик, тимлид администрации и QA. 100 000+ скачиваний.' },
      { period: '2019 — 2022', title: 'Моддинг и пет-проекты', text: 'Моды и собственные прототипы: Unity, C#, 3D, левел-дизайн.' },
    ],
    achievements: [
      { year: '2026', title: '1-е место — межвузовский геймджем «Ctrl + Shift + Create»', stack: 'Git · Blender 3D', url: 'https://t.me/itatmisis/1843' },
      { year: '2026', title: '1-е место — геймджем МТУСИ', stack: 'Git · Blender 3D', url: 'https://t.me/cspo_mtuci/425' },
      { year: '2025', title: '1-е место — предпринимательский тренинг МТУСИ', stack: 'Lean Canvas', url: '' },
    ],
    education: {
      school: 'МТУСИ',
      faculty: 'Факультет информационных технологий',
      program: 'Разработка бизнес-приложений и прикладных информационных систем (C#, C++)',
    },
    collab: {
      team: {
        title: 'Ищу в команду',
        text: 'Ищу людей в команду XABAR. Если хотите делать атмосферный шутер и видеть свой вклад в игре — напишите в Telegram и приложите портфолио.',
        roles: [
          { name: '3D-артист', text: 'Окружение, пропсы, оружие' },
          { name: 'Аудио', text: 'Звуковой дизайн и музыка' },
          { name: 'Озвучка', text: 'Голоса персонажей' },
          { name: 'VFX', text: 'Эффекты, частицы, шейдеры' },
          { name: 'SMM-дизайнер', text: 'Видео и фото для соцсетей' },
          { name: 'PR и маркетинг', text: 'Продвижение, работа с медиа' },
        ],
      },
      investors: {
        title: 'Инвесторам и издателям',
        text: 'Ищу партнёров для продвижения и выпуска XABAR. Подробности — в one-pager.',
        asks: [
          'Маркетинг и рекламная поддержка',
          'Паблишинг: Steam, Google Play, VK Play, RuStore',
        ],
      },
    },
    contact: {
      title: 'Контакты',
      text: 'Для связи предпочтителен Telegram.',
    },
    // ---------- Только для PDF ----------
    cv: {
      title: 'Резюме',
      headings: { summary: 'О себе', experience: 'Опыт', skills: 'Навыки', achievements: 'Достижения', education: 'Образование', contacts: 'Контакты' },
      earlier: {
        period: '2019 — 2022',
        title: 'Моддинг и пет-проекты',
        text: 'Моды и собственные прототипы на Unity: программирование на C#, 3D-моделирование, левел-дизайн.',
      },
    },
    onepager: {
      title: 'XABAR — one-pager',
      subtitle: 'Для инвесторов и издателей',
      headings: {
        concept: 'Концепция', usp: 'Чем выделяется', status: 'Статус и планы', founder: 'Основатель', ask: 'Запрос', contacts: 'Контакты', facts: 'Ключевые данные', amount: 'Бюджет / формат сделки', track: 'Прошлый проект основателя',
      },
      concept: 'Иммерсивный шутер от первого лица в постапокалиптическом мире: одиночная кампания и сетевая игра, кроссплатформенный релиз.',
      usp: [
        'Одиночный режим и мультиплеер в одной игре.',
        'Кроссплатформенность: ПК (Windows) и Android на Unity 6.',
        'Опыт основателя в жанре: участие в мобильном фан-порте S.T.A.L.K.E.R. (SOC_D) — 100 000+ скачиваний, ТОП-2 шутеров RuStore (2025).',
      ],
      facts: [
        { label: 'Жанр', value: 'FPS, иммерсивный шутер, постапокалипсис' },
        { label: 'Режимы', value: 'Одиночная игра, мультиплеер' },
        { label: 'Платформы', value: 'ПК (Windows), мобильные (Android)' },
        { label: 'Движок', value: 'Unity 6' },
        { label: 'Стадия', value: 'Разработка демо-версии, закрытые тесты' },
        { label: 'Старт разработки', value: 'Январь 2026' },
        { label: 'Релиз', value: 'Дата не объявлена' },
        { label: 'Команда', value: '1 разработчик + 25 волонтёров (5 модераторов, 20 тестировщиков)' }, // все без оплаты; юрлица нет
      ],
      status: 'Концепция сформирована. Идёт активная разработка демо-версии игры и закрытое тестирование.', // можно дополнить ближайшими вехами с датами
      founder: 'Юрий Болдырев — основатель XABAR, Unity-разработчик и гейм-дизайнер, 7+ лет в геймдеве. Разработчик и тимлид QA/администрации SOC_D — мобильного фан-порта S.T.A.L.K.E.R. Победитель геймджемов МТУСИ и «Ctrl + Shift + Create» (2026), предпринимательского тренинга МТУСИ (2025).',
      ask: [
        'Маркетинг и рекламная поддержка',
        'Паблишинг: Steam, Google Play, VK Play, RuStore',
      ],
      trackNote: 'SOC_D — некоммерческий мобильный фан-порт S.T.A.L.K.E.R. (2022–2025). Роль: разработчик, тимлид QA и администрации.',
      askAmount: 'Обсуждается индивидуально. Смета на производство и маркетинг — после выхода демо-версии и формирования команды.',
    },
  },

  en: {
    meta: {
      title: 'Yuri Boldyrev — Unity Developer · Game Designer',
      description: 'Unity developer and game designer with 7+ years in game development, founder of XABAR. Building a team for XABAR, a cross-platform immersive shooter.',
    },
    ui: {
      nav: { projects: 'Projects', skills: 'Skills', path: 'Experience', collab: 'Collaboration', contact: 'Contact' },
      downloadCv: 'Resume (PDF)',
      downloadOnepager: 'One-pager (PDF)',
      writeTelegram: 'Message on Telegram',
      themeToggle: 'Toggle theme',
      langToggle: 'Переключить на русский',
      status: { dev: 'In development', done: 'Completed' },
      present: 'present',
      role: 'Role',
      results: 'Results',
      screenshots: 'Screenshots',
      video: 'Video',
      lookingFor: 'Looking for',
      stackLabel: 'Stack',
      rolesLabel: 'Roles',
      tools: 'Tools',
      close: 'Close',
      prev: 'Previous',
      next: 'Next',
      linkTypes: { site: 'Project site', vk: 'VK', telegram: 'Telegram', steam: 'Steam', rustore: 'RuStore', community: 'Community', youtube: 'YouTube' },
      footer: 'This site evolves together with the project.',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    person: {
      name: 'Yuri Boldyrev',
      fullName: 'Yuri Boldyrev',
      initials: 'YB',
      role: 'Unity Developer · Game Designer',
      location: 'Moscow, Russia',
      tagline: 'Building a team for XABAR — a cross-platform immersive post-apocalyptic shooter. 7+ years in game development, including a mobile port of S.T.A.L.K.E.R. with 100,000+ downloads.',
      summary: 'Unity developer and game designer with 7+ years in game development. Grew from modding to the full development cycle: programming and engine porting, mobile optimization, level design and UI, leading QA and community, promotion. One of the developers of SOC_D, a mobile fan port of S.T.A.L.K.E.R. (100,000+ downloads, #2 in Shooters on RuStore in 2025). Currently the founder and lead of my own project XABAR, building its team.',
    },
    stats: [
      { value: '7+', label: 'years in gamedev', href: '#path' },
      { value: '100K+', label: 'SOC_D downloads', href: '#project-socd' },
      { value: '3M+', label: 'SOC_D content views', href: '#project-socd' },
      { value: '3 wins', label: 'at game jams and a business training', href: '#achievements' },
    ],
    projects: {
      xabar: {
        title: 'XABAR',
        kind: 'Original project',
        tagline: 'A cross-platform immersive first-person shooter set in a post-apocalyptic world — single-player and multiplayer.',
        role: 'Founder and project lead: game design, development, SMM, QA',
        bullets: [
          'Define the concept, game design and roadmap.',
          'Build and coordinate the team; set up development and testing processes.',
          'Run promotion and community from the early stages.',
        ],
        metrics: [],
        stack: ['Unity 6', 'C#', 'Git / GitHub', 'Blender', 'Trello'],
        roles: ['Project lead', 'Game designer', 'Programmer', 'DevOps', '3D modeler', 'QA', 'SMM'],
      },
      socd: {
        title: 'SOC_D',
        kind: 'Non-commercial fan project',
        tagline: 'A mobile port of S.T.A.L.K.E.R.: moved from the X-Ray engine to Unity, from C++ to C#.',
        role: 'Developer; lead of project administration and QA',
        bullets: [
          'Programmed and ported game logic from C++ (X-Ray) to C# (Unity).',
          'Mobile optimization, level design, UI.',
          'Led project administration: chats, SMM, community management.',
          'Led the QA department: organized testing and build quality control.',
        ],
        metrics: [
          { value: '100K+', label: 'downloads' },
          { value: '3M+', label: 'views in 9 months' },
          { value: '#2', label: 'in Shooters on RuStore, 2025' },
        ],
        stack: ['Unity', 'C#', 'C++ (X-Ray)', 'Trello'],
        roles: ['Programmer', 'DevOps', 'Level designer', 'UI designer', 'QA lead', 'Administration & SMM lead'],
        note: 'Independent non-commercial fan project, not affiliated with or endorsed by GSC Game World. Development ended in October 2025.',
      },
    },
    skills: [
      {
        title: 'Development',
        items: [
          { name: 'Gameplay programming' },
          { name: 'Mobile optimization' },
          { name: 'DevOps: builds, CI/CD, releases' },
          { name: '3D modeling' },
        ],
      },
      {
        title: 'Game design & product',
        items: [
          { name: 'Game design, GDD' },
          { name: 'Level design' },
          { name: 'UI / UX' },
          { name: 'Roadmapping' },
          { name: 'Lean Canvas' },
        ],
      },
      {
        title: 'Leadership & community',
        items: [
          { name: 'Development leadership' },
          { name: 'QA processes & testing' },
          { name: 'Community management' },
          { name: 'SMM' },
          { name: 'Publishing on RuStore' },
        ],
      },
    ],
    timeline: [
      { period: '2026 — present', title: 'XABAR', text: 'Founder and lead of an original shooter.' },
      { period: '2022 — 2025', title: 'SOC_D', text: 'Developer, lead of administration and QA. 100K+ downloads.' },
      { period: '2019 — 2022', title: 'Modding & pet projects', text: 'Mods and own prototypes: Unity, C#, 3D, level design.' },
    ],
    achievements: [
      { year: '2026', title: '1st place — inter-university game jam “Ctrl + Shift + Create”', stack: 'Git · Blender 3D', url: 'https://t.me/itatmisis/1843' },
      { year: '2026', title: '1st place — MTUCI game jam', stack: 'Git · Blender 3D', url: 'https://t.me/cspo_mtuci/425' },
      { year: '2025', title: '1st place — MTUCI entrepreneurship training', stack: 'Lean Canvas', url: '' },
    ],
    education: {
      school: 'MTUCI (Moscow Technical University of Communications and Informatics)',
      faculty: 'Faculty of Information Technology',
      program: 'Business and applied information systems development (C#, C++)',
    },
    collab: {
      team: {
        title: 'Join the team',
        text: 'I’m looking for people to join XABAR. If you want to build an atmospheric shooter and see your work in the game — message me on Telegram with your portfolio.',
        roles: [
          { name: '3D artist', text: 'Environment, props, weapons' },
          { name: 'Audio', text: 'Sound design and music' },
          { name: 'Voice acting', text: 'Character voices' },
          { name: 'VFX', text: 'Effects, particles, shaders' },
          { name: 'SMM designer', text: 'Video and photo for social media' },
          { name: 'PR & marketing', text: 'Promotion, media relations' },
        ],
      },
      investors: {
        title: 'Investors & publishers',
        text: 'Looking for partners to promote and release XABAR. Details are in the one-pager.',
        asks: [
          'Marketing and advertising support',
          'Publishing: Steam, Google Play, VK Play, RuStore',
        ],
      },
    },
    contact: {
      title: 'Contacts',
      text: 'Telegram is the preferred way to get in touch.',
    },
    cv: {
      title: 'Resume',
      headings: { summary: 'Summary', experience: 'Experience', skills: 'Skills', achievements: 'Achievements', education: 'Education', contacts: 'Contacts' },
      earlier: {
        period: '2019 — 2022',
        title: 'Modding & pet projects',
        text: 'Mods and own Unity prototypes: C# programming, 3D modeling, level design.',
      },
    },
    onepager: {
      title: 'XABAR — one-pager',
      subtitle: 'For investors & publishers',
      headings: {
        concept: 'Concept', usp: 'What sets it apart', status: 'Status & plans', founder: 'Founder', ask: 'The ask', contacts: 'Contacts', facts: 'Key facts', amount: 'Budget / deal format', track: 'Founder’s previous project',
      },
      concept: 'An immersive first-person shooter in a post-apocalyptic world: single-player campaign and online multiplayer, cross-platform release.',
      usp: [
        'Single-player and multiplayer in one game.',
        'Cross-platform: PC (Windows) and Android, built on Unity 6.',
        'Founder’s genre experience: co-developed SOC_D, a mobile fan port of S.T.A.L.K.E.R. — 100K+ downloads, #2 in Shooters on RuStore (2025).',
      ],
      facts: [
        { label: 'Genre', value: 'FPS, immersive shooter, post-apocalypse' },
        { label: 'Modes', value: 'Single-player, multiplayer' },
        { label: 'Platforms', value: 'PC (Windows), mobile (Android)' },
        { label: 'Engine', value: 'Unity 6' },
        { label: 'Stage', value: 'Demo in development, closed testing' },
        { label: 'Development start', value: 'January 2026' },
        { label: 'Release', value: 'TBA' },
        { label: 'Team', value: '1 developer + 25 volunteers (5 moderators, 20 testers)' },
      ],
      status: 'The concept is finalized. The demo is in active development, with closed testing underway.',
      founder: 'Yuri Boldyrev — founder of XABAR, Unity developer and game designer, 7+ years in game development. Developer and QA/administration lead of SOC_D, a mobile fan port of S.T.A.L.K.E.R. Winner of the MTUCI and “Ctrl + Shift + Create” game jams (2026) and the MTUCI entrepreneurship training (2025).',
      ask: [
        'Marketing and advertising support',
        'Publishing: Steam, Google Play, VK Play, RuStore',
      ],
      trackNote: 'SOC_D — a non-commercial mobile fan port of S.T.A.L.K.E.R. (2022–2025). Role: developer, QA and administration lead.',
      askAmount: 'Discussed individually. A production and marketing budget will follow the demo and team formation.',
    },
  },
};
