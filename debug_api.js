import fs from 'fs';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxnOn5LqswnebAuxEijTo4wbgaWqJfBVXQusFKyrty6x1DNppJF2kgEG7vWMfaiWhwP/exec';

async function getDashboard() {
    const url = `${APPS_SCRIPT_URL}?action=getDashboard`;
    console.log(`Fetching from ${url}...`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        fs.writeFileSync('dashboard.json', JSON.stringify(json, null, 2));
        console.log('Saved dashboard.json');

    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

getDashboard();
