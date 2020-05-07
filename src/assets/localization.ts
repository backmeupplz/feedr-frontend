export const messages = {
  ru: {
    feedback: {
      reviews: [
        {
          name: 'Kiku Reise',
          username: 'Kiku_Reise',
          text: `Ведем вместе с командой канал в Телеграме по находкам с Алиэкспресса. И решили дать подписчикам возможность предлагать свои находки с отзывами, но так как в Телеграме нет такой предложки постов как в ВК, мы решили сделать это через какого-нибудь бота, чтобы всей команде были видны сообщения. И тут я вспомнил Feedr.

          Довольно быстро подключил к сервису всю команду, интуитивно просто разобраться в его минималистичном интерфейсе. К слову, команда не покупала подписку сервиса, но доступ к сообщениям бота получила, и это меня очень порадовало. Не нужно платить за всю компанию или давать им доступ к своему аккаунту — можно просто пригласить в админы.
          
          Теперь будем всей командой отвечать подписчикам от одного лица, с сайта или в боте Телеграма. Спасибо большое за удобный Feedr :)`,
        },
      ],
    },
    title: 'Feedr',
    home: {
      info: 'Мульти-платформенный чат для компаний',
      info2:
        'Общайтесь с вашими клиентами в Телеграме, Вайбере и ВКонтакте в одном сервисе',
      info3:
        'Нужен бот для Телеграма, Вайбера или ВКонтакте? Зарегистрируйтесь сегодня и начните общаться с пользователями без промедления!',
      contact:
        'Все еще остались вопросы? <a href="mailto:feedr@borodutch.com">Напишите нам</a>.',
      google: 'Зайти через Гугл',
      facebook: 'Зайти через Фейсбук',
      privacy: 'Политика конфиденциальности',
    },
    edit: {
      edited: 'изменено',
      edits: 'Изменения',
    },
    subscription: {
      subscription: 'Подписка',
      status: 'Статус подписки',
      active: 'Активная',
      inactive: 'Неактивная',
      failed: 'Ошибка платежа',
      early: 'Ранний адоптер',
      update: 'Обновить реквизиты',
      price: '$1/бот месяц',
      earlyStatusText: 'Вы ранний адоптер. Вы офигенны.',
      activeStatusText:
        'Вы подписчик. При отмене подписки, в конце вашего платежного периода будет списана плата за прошедший период, и после этого подписка будет отменена.',
      inactiveStatusText:
        'Чтобы получить доступ к Feedr, купите подписку.\nЦена подписки: $1 за одного бота в месяц.\nСумма списывается в конце месяца и расчитывается по максимальному кол-ву ботов в периоде.',
      failedStatusText:
        'Ошибка платежа: обновите, пожалуйста, свои платежные реквизиты',
      needSub:
        'Для дальнейшего доступа вам необходимо купить подписку, кликнув по кнопке справа вверху.',
      cancel: 'Отменить подписку',
      nextInvoice: 'Следующий платеж',
      nextPeriod: 'Следующий период',
      failedPage: '✋ Ох! Что-то пошло не так. Может, попробуете еще раз? 😳',
      successPage: '✅ У вас получилось! Наслаждайтесь Feedr.',
      noSub: 'Нет подписки',
    },
    merge: {
      header: 'Объединить аккаунты',
      text1:
        'Вы можете объединить разные аккаунты (например, Фейсбук, Гугл, Телеграм) здесь. Просто залогиньтесь в аккаунты, используя кнопки ниже и аккаунты будут объединены. Осторожно: это действие нельзя обратить. Возможно, если вы зашли из России без VPN, вы не видите кнопку Телеграма — тогда либо зайдите через VPN, либо обратитесь к',
      text2: 'в Телеграме и залогиньтесь через него.',
    },
    backToFeedr: 'Вернуться к Feedr',
    bot: {
      bot: 'Бот',
      status: 'Статус',
      owner: 'Владелец',
      type: 'Тип',
      greetings: 'Приветствие',
      update: 'Перезапустить бота',
      delete: 'Удалить бота',
      reject: 'Отказаться',
      about: 'О боте',
    },
    message: {
      new: 'Новое сообщение',
      unsupported: 'Это сообщение пока не поддерживается',
    },
    chat: {
      nochats: 'У вас нет ни одного чата',
      ban: 'Заблокировать',
      banned: 'Заблокирован',
      unban: 'Разблокировать',
      noname: 'Нет имени',
      profile: 'Профиль',
      attachment: 'Вложение',
      select: 'Пожалуйста, выберите чат',
      invite:
        'Ни один пользователь не начал чат с этим ботом. Пожалуйста, сообщите своим пользователям, что бот доступен по адресу',
    },
    errors: {
      login: {
        facebook: 'Не получилось зайти через Фейсбук',
        google: 'Не получилось зайти через Гугл',
        telegram: 'Не получилось зайти через Телеграм',
      },
      merge: {
        telegram: {
          exists:
            'Этот Телеграм аккаунт уже привязан к аккаунту другого пользователя.',
          linked: 'К вашему аккаунту уже привязан Телеграм аккаунт.',
        },
        google: {
          exists:
            'Этот Гугл аккаунт уже привязан к аккаунту другого пользователя.',
          linked: 'К вашему аккаунту уже привязан Гугл аккаунт.',
        },
        facebook: {
          exists:
            'Этот Фейсбук аккаунт уже привязан к аккаунту другого пользователя.',
          linked: 'К вашему аккаунту уже привязан Фейсбук аккаунт.',
        },
      },
      chat: {
        ban: 'Не получилось забанить этого пользователя, ошибка API',
        unban: 'Не получилось разбанить этого пользователя, ошибка API',
        not_found: 'Чат не найден',
        no_access: 'Нет доступа к чату',
      },
      media: {
        loading: 'Ошибка загрузки медиа',
        tobig: 'Ошибка Телеграм API: Размер файла слишком большой (>20мб).',
      },
      bot: {
        isBroken: 'Бот сломан, попробуйте перезапустить его.',
        needSub:
          'У владельца бота нет активной подписки. Отправка сообщения отменена.',
        add: 'Не получилось добавить бота, проверьте токен',
        edit: 'Не получилось отредактировать бота',
        inviteAdmin: 'Не получилось пригласить администратора в бота',
        getAdmins: 'Не получилось получить список администраторов',
        message_rejected: 'Не удалось отправить сообщение',
      },
    },
    media: {
      load: 'Открыть',
      play: 'Слушать',
    },
    notFound: 'Страница не найдена',
    chatsList: 'Выберите чат:',
    place: 'Место',
    type: 'Тип',
    avatar: 'Аватар',
    location: 'Карта',
    oldlink: 'К сожалению, ссылка на файл истекла. Ограничение API Вайбера.',
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
        'Еще не было добавлено ни одного бота, пожалуйста, добавьте вашего первого бота в меню слева.',
      select: 'Пожалуйста, выберите настройку в меню слева.',
      noSubText: 'Для добавления ботов необходима активная подписка.',
    },
    chatlist: 'Список чатов',
    addBot: {
      title: 'Добавить бота',
      token: 'Токен бота',
      vkHelp:
        'Для того, чтобы получить API ключ сообщества, необходимо открыть раздел «Управление» вашего сообщества ВКонтакте, перейти в пункт «Настройки» —> «Работа с API», затем в разделе «Long Poll API» включить его, включить все события типа «Сообщение» и, наконец, в разделе «Ключи доступа» создать ключ с доступом к управлению сообществом и сообщениями.\n\nТакже рекомендуется включить в разделе "Сообщения" —> "Настройки для бота" опции "Возможности ботов" и "Добавить кнопку «Начать»".',
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
      notemail: 'Это не имеил',
      notnumber: 'Это поле должно быть числом',
      tomuchtext: 'Длинна сообщения не может быть длиннее 4000 символов.',
      tokenformat:
        'Формат токена должен быть вида 12345678:AasdkasdWAKDa-wdLWsd',
      vibertokenformat: 'Формат токена должен быть вида AbC231-DeF453-GJ675',
      greetings: {
        toomanychars: 'Слишком много символов (>2000)',
      },
    },
    noBots:
      'У вас еще нет ботов, пожалуйста, добавьте бота, кликнув по кнопке справа вверху.',
    navbar: {
      bots: 'Боты',
      logout: 'Выйти',
    },
    themes: {
      dark: 'Темная тема',
      on: 'Вкл',
      off: 'Выкл',
    },
    text: {
      copy: 'Копировать ссылку',
      copied: 'Ссылка скопирована',
    },
    you: 'Вы',
    forwarded_message: {
      user_hidden:
        'Этот пользователь запретил доступ к информации о его аккаунте в пересланных сообщениях',
      channel_private: 'Этот канал приватный',
      group_private: 'Эта группа приватная',
      no_username: 'У этого пользователя нет юзернейма',
      forwarded_from: 'Переслано от:',
    },
    feed: 'Лента',
  },
  en: {
    feedback: {
      reviews: [
        {
          name: 'Kiku Reise',
          username: 'Kiku_Reise',
          text: `We're running a channel with the team in Telegram for Aliexpress finds. So we decided to give subscribers the opportunity to offer their findings with feedback, but since there is no such offer of posts in Telegram as in VK, we decided to do it through some bot so that the whole team could see the messages. And that's when I remembered Feedr.

          Quite quickly connected the whole team to the service, intuitively just to understand its minimalistic interface. By the way, the team didn't buy a subscription to the service, but I got access to the bot's messages, and I was very happy about it. You don't have to pay for the whole company or give them access to your account - you can just invite them to the admins.
          
          Now we will respond as a team to subscribers from one person, from the site or in the Telegram bot. Thank you so much for the handy Feedr :)`,
        },
      ],
    },
    title: 'Feedr',
    home: {
      info: 'Multi-platform chat solution for companies',
      info2:
        'Connect with your customers and followers on Telegram, Viber and VK in one place',
      info3:
        'Need a Telegram, Viber or VK bot? Sign up and start talking to your customers right away!',
      contact:
        'Still got questions? <a href="mailto:feedr@borodutch.com">Contact sales</a>.',
      google: 'Login with Google',
      facebook: 'Login with Facebook',
      privacy: 'Privacy policy',
    },
    edit: {
      edited: 'edited',
      edits: 'Edits',
    },
    subscription: {
      subscription: 'Subscription',
      status: 'Subscription status',
      active: 'Active',
      inactive: 'Inactive',
      failed: 'Payment failed',
      early: 'Early adopter',
      update: 'Update card details',
      price: '$1/bot month',
      earlyStatusText: 'You are an early adopter. You are breathtaking.',
      activeStatusText:
        'You are an active subscriber. If you cancel your subscription now, you will be charged in the end of the period.',
      inactiveStatusText:
        'To get access to Feedr, you need do buy a subscription.\nSubscription price is $1 per bot per month.\nThe amount is charged at the end of the month and is calculated by the maximum number of bots used in the period.',
      failedStatusText:
        'Error with payment or adding card, please, update the card details',
      needSub:
        'For further access you need to buy a subscription by clicking on the button in the top right.',
      cancel: 'Cancel subscription',
      nextInvoice: 'Next invoice',
      nextPeriod: 'Next period',
      failedPage: '✋ Wait, something went wrong. Could you retry? 😳',
      successPage: '✅ You are all done! Enjoy the Feedr experience.',
      noSub: 'No subscription',
    },
    merge: {
      header: 'Merge accounts',
      text1:
        'You can merge multiple accounts (e.g. Facebook, Google, Telegram) here. Just login to the accounts with the buttons below and the accounts will be merged.',
    },
    backToFeedr: 'Back to Feedr',
    bot: {
      bot: 'Bot',
      status: 'Status',
      owner: 'Owner',
      type: 'Type',
      greetings: 'Greetings',
      update: 'Re-start bot',
      delete: 'Delete bot',
      reject: 'Refuse',
      about: 'About',
    },
    message: {
      new: 'New message',
      unsupported: 'This message is not yet supported',
    },
    chat: {
      nochats: 'You have no chats yet.',
      ban: 'Ban',
      banned: 'Banned',
      unban: 'Unban',
      noname: 'No name',
      profile: 'Profile',
      attachment: 'Attachment',
      select: 'Please, select a chat',
      invite:
        'No users have started a chat with this bot. Please, let your users know that the bot is reachable at',
    },
    errors: {
      login: {
        facebook: 'Could not login with Facebook',
        google: 'Could not login with Google',
        telegram: 'Could not login with Telegram',
      },
      merge: {
        telegram: {
          exists:
            "This Telegram account is already linked to another user's account.",
          linked: 'A Telegram account is already linked to your account.',
        },
        google: {
          exists:
            "This Google account is already linked to another user's account.",
          linked: 'A Google account is already linked to your account.',
        },
        facebook: {
          exists:
            "This Facebook account is already linked to another user's account.",
          linked: 'A Facebook account is already linked to your account.',
        },
      },
      chat: {
        ban: 'Could not ban this user, API error',
        unban: 'Could not unban this user, API error',
        not_found: 'Chat not found',
        no_access: "You don't have access to this chat",
      },
      media: {
        loading: 'Media loading error',
        tobig: 'Telegram API Error: File size is too big for download (>20mb).',
      },
      bot: {
        isBroken: 'Bot is broken, try restart it.',
        needSub:
          'Bot owner does not have an active subscription. Message sending is canceled.',
        add: 'Could not add bot, please, check token',
        edit: 'Could not edit bot',
        inviteAdmin: 'Could not invite the admin to the bot',
        getAdmins: 'Could not get the list of the admins',
        message_rejected: 'Failed to send the message',
      },
    },
    media: {
      load: 'Load',
      play: 'Play',
    },
    notFound: 'Page not found',
    chatsList: 'Select chat:',
    place: 'Place',
    type: 'Type',
    avatar: 'Avatar',
    location: 'Map',
    oldlink: 'Sorry, link to this media has expired. Viber API restriction.',
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
      'You have been invited by {inviter} to become an administrator of {bot}',
    currentMessage: 'Current message',
    cancel: 'Cancel',
    botList: {
      title: 'Bots',
      noBotsText:
        'No bots were added yet, please, use the "Add bot" option in tne left-side menu to add your first bot.',
      select: 'Please, select an option in the left-side menu',
      noSubText: 'You need an active subscription to add bots.',
    },
    chatlist: 'Chats',
    addBot: {
      title: 'Add bot',
      token: 'Bot token',
      vkHelp:
        'To obtain API key for the community go to the settings of the community, then to the API section, then turn on the "Long Poll API" setting as well as all the message types. After that create an API key with the access to control the community and to community messages.\n\nAlso we recommend turning on the "Start" button in the section "Messages" -> "Bot settings" -> "Bot abilities"',
    },
    editBot: {
      title: 'Edit the greeting message',
      greeting: 'Greeting message',
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
      confirm:
        'Are you sure you want to delete {name} administrator from the bot?',
      noadmins: 'No administrators',
    },
    deleteBot: {
      confirm: 'Are you sure you want to delete {name}?',
    },
    rejectBot: {
      confirm: 'Are you sure you want refuse to administer the bot {name}?',
    },
    validation: {
      needtext: "This field can't be empty",
      notemail: 'This is not a valid email',
      notnumber: 'This field should be number',
      tomuchtext: "Message length can't be longer than 4000 characters",
      tokenformat: 'Token format should be 12345678:AasdkasdWAKDa-wdLWsd',
      vibertokenformat: 'Token format should be AbC231-DeF453-GJ675',
      greetings: {
        toomanychars: 'Too many characters (>2000)',
      },
    },
    noBots:
      'You do not have any bots yet, please, add one by clicking the button on the top right.',
    navbar: {
      logout: 'Logout',
      bots: 'Bots',
    },
    themes: {
      dark: 'Dark theme',
      on: 'On',
      off: 'Off',
    },
    text: {
      copy: 'Copy link',
      copied: 'Link was copied',
    },
    you: 'You',
    forwarded_message: {
      user_hidden:
        'This user disallowed adding links to his account in forwarded messages',
      channel_private: 'This channel is private',
      group_private: 'This group is private',
      no_username: "This user doesn't have a username",
      forwarded_from: 'Forwarded from:',
    },
    feed: 'Feed',
  },
}
