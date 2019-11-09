export const messages = {
  ru: {
    title: 'Feedr',
    home: {
      info: 'Мульти-платформенный чат для компаний',
      google: 'Зайти через Гугл',
      facebook: 'Зайти через Фейсбук',
      privacy: 'Политика конфиденциальности',
    },
    message: {
      unsupported: 'Это сообщение пока не поддерживается :(',
    },
    errors: {
      login: {
        facebook: 'Не получилось зайти через Фейсбук',
        google: 'Не получилось зайти через Гугл',
        telegram: 'Не получилось зайти через Телеграм',
      },
      chat: {
        ban: 'Не получилось забанить этого пользователя, ошибка API',
        unban: 'Не получилось разбанить этого пользователя, ошибка API',
      },
      media: {
        loading: 'Ошибка загрузки медиа',
        tobig: 'Telegram API Error: Размер файла слишком большой (>20mb).',
      },
      bot: {
        add: 'Не получилось добавить бота, проверьте токен',
        edit: 'Не получилось отредактировать бота',
      },
    },
    media: {
      load: 'Открыть',
    },
    notFound: 'Страница не найдена',
    chatsList: 'Выберите чат:',
    place: 'Место',
    location: 'Карта',
    cookie: {
      message:
        'Этот вебсайт использует печеньки для предоставления лучшего сервиса',
      button: 'Отличненько',
    },
    close: 'Закрыть',
    save: 'Сохранить',
    cancel: 'Отменить',
    botList: {
      title: 'Боты',
      noBotsText:
        'Еще не было добавлено ни одного бота, пожалуйста, нажмите на плюс ниже, чтобы добавить вашего первого бота.',
    },
    addBot: {
      title: 'Добавить бота',
      token: 'Токен бота',
    },
    editBot: {
      title: 'Редактировать приветствие',
      greeting: 'Приветствие',
    },
    deleteBot: {
      confirm: 'Вы уверены, что хотите удалить бота {name}?',
    },
    validation: {
      needtext: 'Это поле не может быть пустым.',
      tomuchtext: 'Длинна сообщения не может быть длиннее 4000 символов.',
      tokenformat:
        'Формат токена должен быть вида 12345678:AasdkasdWAKDa-wdLWsd',
      greetings: {
        toomanychars: 'Слишком много символов (>2000)',
      },
    },
    noBots:
      'У вас еще нет ботов, пожалуйста, добавьте бота, кликнув по кнопке справа вверху.',
  },
  en: {
    title: 'Feedr',
    home: {
      info: 'Multi-platform chat solution for companies',
      google: 'Login with Google',
      facebook: 'Login with Facebook',
      privacy: 'Privacy policy',
    },
    message: {
      unsupported: 'This message is not yet supported :(',
    },
    errors: {
      login: {
        facebook: 'Could not login with Facebook',
        google: 'Could not login with Google',
        telegram: 'Could not login with Telegram',
      },
      chat: {
        ban: 'Could not ban this user, API error',
        unban: 'Could not unban this user, API error',
      },
      media: {
        loading: 'Media loading error',
        tobig:
          'Telegram API Error: File size to big for download (>20mb). Sorry.',
      },
      bot: {
        add: 'Could not add bot, check token',
        edit: 'Could not edit bot',
      },
    },
    media: {
      load: 'Load',
    },
    notFound: 'Page not found',
    chatsList: 'Select chat:',
    place: 'Place',
    location: 'Map',
    cookie: {
      message: 'This website uses cookies to provide you with better service',
      button: 'Got it',
    },
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    botList: {
      title: 'Bots',
      noBotsText:
        'No bots added yet, please, use the plus button below to add your first bot.',
    },
    addBot: {
      title: 'Add bot',
      token: 'Bot token',
    },
    editBot: {
      title: 'Edit greetings message',
      greeting: 'Greetings message',
    },
    deleteBot: {
      confirm: 'Are you sure you want to delete the bot {name}?',
    },
    validation: {
      needtext: "This field can't be empty",
      tomuchtext: "Message length can't be longer than 4000 characters",
      tokenformat: 'Token format should be 12345678:AasdkasdWAKDa-wdLWsd',
      greetings: {
        toomanychars: 'Too many characters (>2000)',
      },
    },
    noBots:
      'You do not have any bots yet, please, add one by clicking the button on the top right.',
  },
}
