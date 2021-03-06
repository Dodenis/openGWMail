module.exports = Object.freeze({
  APP_ID: 'opengwmail.opengwmail',

  MAILBOX_INDEX_KEY: '__index__',
  MAILBOX_SLEEP_WAIT: 1000 * 30, // 30 seconds

  WEB_URL: 'https://openwmail.github.io/',
  GITHUB_URL: 'https://github.com/Dodenis/openGWMail/',
  GITHUB_ISSUE_URL: 'https://github.com/Dodenis/openGWMail/issues',
  UPDATE_DOWNLOAD_URL: 'https://github.com/Dodenis/openGWMail/releases',
  UPDATE_CHECK_URL: 'https://openwmail.github.io/version.json',
  PRIVACY_URL: 'https://openwmail.github.io/privacy',
  USER_SCRIPTS_WEB_URL: 'https://github.com/Thomas101/wmail-user-scripts',
  UPDATE_CHECK_INTERVAL: 1000 * 60 * 60 * 24, // 24 hours²

  GMAIL_PROFILE_SYNC_MS: 1000 * 60 * 60, // 60 mins
  GMAIL_UNREAD_SYNC_MS: 1000 * 60, // 60 seconds
  GMAIL_NOTIFICATION_MAX_MESSAGE_AGE_MS: 1000 * 60 * 60 * 2, // 2 hours
  GMAIL_NOTIFICATION_FIRST_RUN_GRACE_MS: 1000 * 30, // 30 seconds

  REFOCUS_MAILBOX_INTERVAL_MS: 300,

  DB_EXTENSION: 'wmaildb',
  DB_WRITE_DELAY_MS: 500, // 0.5secs

  // New additions for openWMail
  THOMAS_URL: 'https://github.com/Thomas101/'
})
