const FILEPATH = '/Users/benedictbelz/Documents/Entwicklung/ac-missing-translations-service/missing-translations-db.json';

const loadMissingTranslations = async () => {
    return fetch('http://localhost:3000/missingtranslation')
        .then(res => res.json())
        .then(data => data)
        .catch(err => { throw err });
}

const listMissingTranslations = async () => {
    try {
        // GET DATA & ENTRIES
        const data = await loadMissingTranslations();
        const entries = document.getElementById('entries');
        // GO THROUGH KEYS
        Object.keys(data).forEach(key => {
            // CREATE ENTRY
            const entry = document.createElement('div');
            entry.className = 'entry';
            entries.appendChild(entry);
            // CREATE H2
            const h2 = document.createElement('h2');
            h2.className = 'key';
            h2.innerHTML = key;
            entry.appendChild(h2);
            // CREATE UL
            const ul = document.createElement('ul');
            entry.appendChild(ul);
            // CREATE LI
            const li = document.createElement('li');
            ul.appendChild(li);
            // CREATE CUSTOMER
            const customer = document.createElement('p');
            customer.innerHTML = 'Customer';
            li.appendChild(customer);
            // CREATE COUNT
            const count = document.createElement('p');
            count.innerHTML = 'Count';
            li.appendChild(count);
            // GO THROUGH VALUES
            Object.keys(data[key]).forEach(value => {
                console.log('VALUE', value);
                // CREATE LI
                const li = document.createElement('li');
                ul.appendChild(li);
                // CREATE CUSTOMER
                const customer = document.createElement('p');
                customer.innerHTML = value;
                li.appendChild(customer);
                // CREATE COUNT
                const count = document.createElement('p');
                count.innerHTML = ((data[key])[value]).count;
                li.appendChild(count);
            });
        });
    } catch (err) {
        console.error('Could not load missing translations...');
    }    
}

document.addEventListener('readystatechange', event => {
    switch (document.readyState) {
        case "loading":
            break;
        case "interactive":
            listMissingTranslations();
            break;
        case "complete":
            break;
    }
});