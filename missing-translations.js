const cors = require('cors');
const express = require('express');
const database = require('./database');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: '*', allowedHeaders: ['Content-Type'] }));

app.get('/missingtranslation', async (req, res) => {
    // DEFINE RESPONSE
    const response = {};
    // GET DATABASE
    let data = await database.get();
    //
    if (data.length === 0) {
        res.status(200).send(response);    
    } else {
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
        res.status(200).send(response);
    }
});

app.post('/missingtranslation', async (req, res) => {
    // GET MESSAGE
    const message = req.body;
    // CHECK CUSTOMER ID & I18NKEY 
    if (
        (!message.customerId || typeof message.customerId !== 'number') &&
        (!message.i18nKey || typeof message.i18nKey !== 'string')
    ) {
        res.status(400).send({
            message: 'Customer ID and i18nKey are missing or invalid'
        });
        return;
    }
    // CHECK CUSTOMER ID
    if (!message.customerId || typeof message.customerId !== 'number') {
        res.status(400).send({
            message: 'Customer ID is missing or invalid'
        });
        return;
    }
    // CHECK I18NKEY
    if (!message.i18nKey || typeof message.i18nKey !== 'string') {
        res.status(400).send({
            message: 'i18nKey is missing or invalid'
        });
        return;
    }
    // TRY CONNECTION TO DATABASE
    try {
        // GET DATA
        const data = await database.select(message.i18nKey);
        // IF NO DATA AVAILABLE
        if (data.length === 0) {
            await database.insert(message.i18nKey, message.customerId, 1);
        }
        // IF DATA AVAILABLE
        else {
            const entry = data.find(item => item.customerId === message.customerId);
            if (entry) {
                entry.count++;
                await database.update(entry.id, entry.count);
            } else {
                await database.insert(message.i18nKey, message.customerId, 1);
            }
        }
        // SEND SUCCESS MESSAGE
        res.status(200).send({ message: 'Success!' });
    }
    // CATCH ERROR FROM DATABASE
    catch(error) {
        console.error(error);
        res.status(400).send({ message: error });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});