module.exports = {
    migrate: 'safe',
    connection: 'missingTranslation',
    attributes: {
      id: {
        type: 'INTEGER',
      },
      i18nKey: {
        type: 'STRING'
      },
      count: {
        type: 'INTEGER',
      },
      customerId: {
        type: 'INTEGER',
      },
      createdAt: {
        type: 'STRING'
      },
      updatedAt: {
        type: 'STRING'
      },
    }
  }
  