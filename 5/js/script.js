import { messages } from '../../lang/messages/en/user.js';
class PatientInfoManager {
    constructor(serverEndpoint) {
        this.serverEndpoint = serverEndpoint;
    }

    async insertPredefinedData(data) {
        return this.sendRequest(`${this.serverEndpoint}/api/v1/insert`, 'POST', JSON.stringify(data));
    }

    async submitQuery(query) {
        let method = 'POST';
        let url = `${this.serverEndpoint}/api/v1/query`;

        if (query.toUpperCase().startsWith('SELECT')) {
            method = 'GET';
            url += '?query=' + encodeURIComponent(query);
        } else {
            url = `${this.serverEndpoint}/api/v1/insert`;
        }

        return this.sendRequest(url, method, method === 'POST' ? JSON.stringify({ query: query }) : null);
    }

    async sendRequest(url, method, body = null) {
        const headers = {
            'Content-Type': 'application/json',
        };

        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: body
        });

        return response.json();
    }
}

class PatientInfoSystem {
    constructor(manager) {
        this.manager = manager;
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('insertData').addEventListener('click', () => this.insertPredefinedData());
        document.getElementById('submitQuery').addEventListener('click', () => this.submitQuery());
    }

    insertPredefinedData() {
        const data = [

            {
                name: 'Sara Brown',
                dateOfBirth: '1901-01-01',
            },

            {
                name: 'John Smith',
                dateOfBirth: '1941-01-01',
            },

            {
                name: 'Jack Ma',
                dateOfBirth: '1961-01-30',
            },

            {
                name: 'Elon Musk',
                dateOfBirth: '1999-01-01',
            }

           
        ];

        this.manager.insertPredefinedData(data)
            .then(response => {
                console.log(messages.insertDataSuccess); 
                this.displayResponse(response);
            })
            .catch(error => console.error(messages.errorPrefix, error));
    }

    submitQuery() {
        const query = document.getElementById('sqlQuery').value.trim();
        this.manager.submitQuery(query)
            .then(response => {
                console.log(messages.submitQuerySuccess); 
                this.displayResponse(response);
            })
            .catch(error => console.error(messages.errorPrefix, error));
    }

     displayResponse(data) {
        //document.getElementById('response').innerText = JSON.stringify(data, null, 2);
        const responseElement = document.getElementById('response');
        responseElement.innerHTML = ''; // clear previous content
        if (data && data.data) {
            const patients = data.data;
            const list = document.createElement('ul'); // create a unordered list element
            patients.forEach(patient => { // map the patients and append them to the unordered list element
                const item = document.createElement('li');
                // add text content - format the DOB so its easier to read
                item.textContent = `Patient ID: ${patient.patientid}, Name: ${patient.name}, Date of Birth: ${new Date(patient.dateOfBirth).toLocaleDateString()}`;
                list.appendChild(item);
        });
        
        responseElement.appendChild(list);
    } else {
        responseElement.innerText = messages.noDataAvailable; 
    }
    }
}

class ApplicationInitializer {
    static initializeApplication() {
        const serverEndpoint = 'https://ondrik.dev/comp4537/labs/5a';
        const manager = new PatientInfoManager(serverEndpoint);
        new PatientInfoSystem(manager);
    }
    
    static {
        ApplicationInitializer.initializeApplication();
    }
}
