const _ = require('lodash')

const MissingTranslationController = {

	create: async(req, res) => {
		// GET PARAMS & USER
		const body = req.body
		const user = req.user
		// CHECK PARAMS & USER
		if (
			(!body || !body.i18nKey || typeof body.i18nKey !== 'string') &&
			(!user || !user.customerId)
		) {
			res.status(400).send({
				message: 'CustomerId and i18nKey are missing or invalid'
			})
			return
		}
		// CHECK PARAMS
		if (!body || !body.i18nKey || typeof body.i18nKey !== 'string') {
			res.status(400).send({
				message: 'i18nKey is missing or invalid'
			})
			return
		}
		// CHECK USER
		if (!user || !user.customerId) {
			res.status(400).send({
				message: 'CustomerId is missing or invalid'
			})
			return
		}
		// TRY CONNECTION TO DATABASE
		try {
			// GET DATA
			const data = await new Promise((resolve, reject) => {
				MissingTranslation.find({ 
					i18nKey: body.i18nKey,
					customerId: user.customerId
				}).exec((error, data) => {
					error ? reject(error) : resolve(data)
				})
			})
			// IF NO DATA AVAILABLE
			if (data.length === 0) {
				const entry = await new Promise((resolve, reject) => {
					MissingTranslation.create({ 
						i18nKey: body.i18nKey,
						customerId: user.customerId,
						count: 1
					}).exec((error, data) => {
						error ? reject(error) : resolve(data)
					})
				})
				res.status(200).json(entry)
			}
			// IF DATA AVAILABLE
			else {
				const entry = data[0];
				entry.count = entry.count + 1
				await new Promise((resolve, reject) => {
					MissingTranslation.update({ id: entry.id }, { 
						count: entry.count
					}).exec((error, data) => {
						error ? reject(error) : resolve(data)
					})
				})
				res.status(200).json(entry)	
			}
		} 
		// CATCH ERROR FROM DATABASE
		catch(error) {
			res.status(400).send({ message: 'Unable to write to database' });
		}
	},

	read: async(req, res) => {
		// DEFINE RESPONSE
		const response = {};
		// TRY CONNECTION TO DATABASE
		try {
			// GET DATA
			const data = await new Promise((resolve, reject) => {
				MissingTranslation.find({}).exec((error, data) => {
					error ? reject(error) : resolve(data)
				})
			})
			// IF NO DATA AVAILABLE
			if (data.length === 0) {
				res.status(200).json(response)
			}
			// IF DATA AVAILABLE
			else {
				// DEFINE I18NKEYS
				const i18nKeys = [];
				// GO THROUGH DATA
				data.forEach(item => {
					if (!i18nKeys.includes(item.i18nKey)) {
						i18nKeys.push(item.i18nKey);
					}
				});
				// GO THROUGH KEYS
				i18nKeys.forEach(i18nKey => {
					let total = 0;
					let filter = data.filter(item => item.i18nKey === i18nKey);
					response[`${i18nKey}`] = {};
					filter.forEach(item => {
						total += item.count;
						response[`${i18nKey}`][Number(item.customerId)] = { count: Number(item.count) };
					});
					response[i18nKey]['Total'] = { count: Number(total) };
				});
				// SEND RESPONSE
				res.status(200).json(response)	
			}
		}
		// CATCH ERROR FROM DATABASE
		catch(error) {
			res.status(400).send({ message: 'Unable to get data from database ' });
		}
	},

	routes: [
		{ method: 'get', path: '/v1/missingtranslation', action: 'read', policies: ['authenticated'] },
		{ method: 'post', path: '/v1/missingtranslation', action: 'create', policies: ['authenticated'] },
	]
}

module.exports = MissingTranslationController
