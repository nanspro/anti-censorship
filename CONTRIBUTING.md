# Local environment setup

## Prerequisites

- Twitter and Tumblr API keys and Consumer Token and Secret. Google's perspective api key.

  For Twitter: https://developer.twitter.com/en/apps, Tumblr: https://www.tumblr.com/docs/en/api/v2 and Perspective Key: https://github.com/conversationai/perspectiveapi/tree/master/1-get-started

  _Note: Let us know if you face any trouble, we have a deployed version of our app where you can use our keys._

- Git, Node installed along with proper node manager like npm or yarn (Make sure your node version is >= 12.1.0)

## Steps to run locally

- Clone the repository https://github.com/nanspro/anti-censorship

  ```bash
  git clone https://github.com/nanspro/anti-censorship
  ```

- Install dependencies

  ```bash
  cd anti-censorship
  yarn # (or npm install)
  ```

- Setiing env variables

  `mv .env.sample .env`

  Open .env now and set all those vars with proper values

- Setting up netlify
  `mv netlify.toml.template netlify.toml`

- Building and Running lamda server

  ```bash
  yarn build:lambda # will build your lambda functions in lambda-build directory
  yarn start:lambda # will start a lambda server on localhost:9000
  ```

- Running WebUI

  ```bash
  yarn start
  ```

  Note: Open another terminal to run this command

Go to localhost:3000 to view locally deployed app ui

## Running lambda functions to save to bluzelle

- Go to http://localhost:9000/.netlify/functions/{functionName} to run lambda functions locally.

- functionName = saveTwitter (to save latest tweets to bluzelle)

- functionName = saveTumblr (to save tumblr posts to bluzelle)

## Static Values

1. Currently we are hardcoding what tumblr blogs to use in lambda function saveTumblr.js. It could be changed or made dynamic by changing the file directly.
2. Lambda func saveTwitter.js handler function has some hardcoded values like `getTags(1, 10)` where 1 represents World ID (look for trending topics in the world), it could be changed to any location based geoId to fetch tweets from that area. 10 represents that we will only fetch top 10 trends/tags from the location. Also `trackTags(tags, 10)` is another function, in which we hardcode 10 as the no of tweets in total which we will save to bluzelle.

_Note: These values are hardcoded to avoid large requests using our api keys and also to make the whole process overall faster. The point of this application is only to demonstrate what could be done with bluzelle and it should not be taken to production level without making some necessary changes first_
