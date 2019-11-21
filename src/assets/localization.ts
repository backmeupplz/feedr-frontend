export const messages = {
  ru: {
    title: 'Feedr',
    home: {
      info: 'Мульти-платформенный чат для компаний',
      google: 'Зайти через Гугл',
      facebook: 'Зайти через Фейсбук',
      privacy: 'Политика конфиденциальности',
    },
    bot: {
      status: 'Статус',
      owner: 'Владелец',
      greetings: 'Приветствие',
    },
    message: {
      unsupported: 'Это сообщение пока не поддерживается :(',
    },
    chat: {
      ban: 'Заблокировать',
      banned: 'Заблокирован',
      unban: 'Разблокировать',
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
        inviteAdmin: 'Не получилось пригласить администратора в бота',
        getAdmins: 'Не получилось получить список администраторов',
      },
    },
    media: {
      load: 'Открыть',
    },
    notFound: 'Страница не найдена',
    chatsList: 'Выберите чат:',
    place: 'Место',
    location: 'Карта',
    accept: 'Принять',
    reject: 'Отклонить',
    cookie: {
      message:
        'Этот вебсайт использует печеньки для предоставления лучшего сервиса',
      button: 'Отличненько',
    },
    close: 'Закрыть',
    save: 'Сохранить',
    yes: 'Да',
    no: 'Нет',
    invite: 'Пригласить',
    InviteMessage:
      'Вы были приглашены {inviter} стать администратором бота {bot}',
    currentMessage: 'Текущее сообщение',
    cancel: 'Отменить',
    botList: {
      title: 'Боты',
      noBotsText:
        'Еще не было добавлено ни одного бота, пожалуйста, нажмите на плюс ниже, чтобы добавить вашего первого бота.',
    },
    chatlist: 'Список чатов',
    addBot: {
      title: 'Добавить бота',
      token: 'Токен бота',
    },
    editBot: {
      title: 'Редактировать приветствие',
      greeting: 'Приветствие',
    },
    admin: {
      status: 'Статус',
      name: 'Имя',
      actions: 'Действия',
      admin: 'Администратор',
      invited: 'Приглашен',
      admins: 'Администраторы',
      type: 'Тип аккаунта',
      invite: 'Пригласить администратора',
      confirm: 'Вы уверены, что хотите удалить администратора {name} из бота?',
      noadmins: 'Нет администраторов',
    },
    deleteBot: {
      confirm: 'Вы уверены, что хотите удалить бота {name}?',
    },
    rejectBot: {
      confirm:
        'Вы уверены, что хотите отказаться от администрирования бота {name}?',
    },
    validation: {
      needtext: 'Это поле не может быть пустым.',
      notemail: 'Это не E-mail',
      notnumber: 'Это поле должно быть числом',
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
    bot: {
      status: 'Status',
      owner: 'Owner',
      greetings: 'Greetings message',
    },
    message: {
      unsupported: 'This message is not yet supported :(',
    },
    chat: {
      ban: 'Ban',
      banned: 'Banned',
      unban: 'Unban',
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
        inviteAdmin: 'Could not invite admin to bot',
        getAdmins: 'Could not get list of admins',
      },
    },
    media: {
      load: 'Load',
    },
    notFound: 'Page not found',
    chatsList: 'Select chat:',
    place: 'Place',
    location: 'Map',
    accept: 'Accept',
    reject: 'Reject',
    cookie: {
      message: 'This website uses cookies to provide you with better service',
      button: 'Got it',
    },
    close: 'Close',
    save: 'Save',
    yes: 'Yes',
    no: 'No',
    invite: 'Invite',
    InviteMessage:
      'You have been invited by {inviter} to become the administrator of {bot}',
    currentMessage: 'Current message',
    cancel: 'Cancel',
    botList: {
      title: 'Bots',
      noBotsText:
        'No bots added yet, please, use the plus button below to add your first bot.',
    },
    chatlist: 'Chats',
    addBot: {
      title: 'Add bot',
      token: 'Bot token',
    },
    editBot: {
      title: 'Edit greetings message',
      greeting: 'Greetings message',
    },
    admin: {
      status: 'Status',
      name: 'Name',
      actions: 'Actions',
      admin: 'Administrator',
      invited: 'Invited',
      admins: 'Administrators',
      type: 'Type of account',
      invite: 'Invite the administrator',
      confirm: 'Are you sure you want to delete {name} administrator from bot?',
      noadmins: 'No administrators',
    },
    deleteBot: {
      confirm: 'Are you sure you want to delete the bot {name}?',
    },
    rejectBot: {
      confirm: 'Are you sure you want refuse to administer the bot {name}?',
    },
    validation: {
      needtext: "This field can't be empty",
      notemail: 'This is not E-mail',
      notnumber: 'This field should be number',
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
