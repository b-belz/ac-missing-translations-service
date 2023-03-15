module.exports.session = {
  nodeCache: {}, // key: value store
  // which properties are required from IAM
  properties: {
    user: ['id', 'firstname', 'lastname', 'email', 'customerId'],
  },
  storageTTL: 60
}