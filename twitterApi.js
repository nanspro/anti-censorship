import analyze from "./filter";

const tags = [
    'trump',
    'china',
    'covid',
    'AntiModi'
];
var Twit = require('twit');

var T = new Twit({
    consumer_key: '1vjHlLXELHVzkNAWZ0msm6cAq',
    consumer_secret: 'MPawQEtJR8RN1MNAirgeKMVv5EqQXfLmWx51jkKCpno0LPCIUC',
    access_token: '3278644896-a0D15sIOnfIghdgmcXxcKoqxwyb8jxFqZAyzTbY',
    access_token_secret: 'k6o04ihpvgY3NSBx9cVK1jizMmYzL675RfQPqcO2TcBlD'
});

T.get('account/verify_credentials', {
    include_entities: false,
    skip_status: true,
    include_email: false
}, function (err, data, res) {
    if(err){
        console.log(err);
    }
    console.log('Authentication successful');
});

// search twitter for all tweets containing the word 'china' since Jan 1, 2020
T.get('search/tweets', { q: 'china since:2020-01-1', count: 10 }, function(err, data, response) {
    console.log(data);
});

// connecting to stream
var stream = T.stream('statuses/filter', { track: tags });

stream.on('tweet', function (tweet) {
  console.log(tweet)
})