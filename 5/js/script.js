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
        const data = {
            // predefined data
            name: 'John Doe',
            age: 30,
            gender: 'Male'
        };

        this.manager.insertPredefinedData(data)
            .then(response => this.displayResponse(response))
            .catch(error => console.error('Error:', error));
    }

    submitQuery() {
        const query = document.getElementById('sqlQuery').value.trim();
        this.manager.submitQuery(query)
            .then(response => this.displayResponse(response))
            .catch(error => console.error('Error:', error));
    }

    displayResponse(data) {
        document.getElementById('response').innerText = JSON.stringify(data, null, 2);
    }
}

class ApplicationInitializer {
    static initializeApplication() {
        const serverEndpoint = 'YOUR_SERVER2_ENDPOINT';
        const manager = new PatientInfoManager(serverEndpoint);
        new PatientInfoSystem(manager);
    }
    
    // self-executing method or static block for initialization
    static {
        ApplicationInitializer.initializeApplication();
    }
}
