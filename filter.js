var googleapis = require('googleapis');

API_KEY = 'copy-your-api-key-here'
DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1'

export async function analyze(text, attributes) {
    googleapis.discoverAPI(DISCOVERY_URL, (err, client) => {
    if (err) throw err;
    var analyzeRequest = {
        comment: text,
        requestedAttributes: attributes
    };
    client.comments.analyze({key: API_KEY, resource: analyzeRequest}, (err, response) => {
        if (err) throw err;
        console.log(JSON.stringify(response, null, 2));
    });
    });
}