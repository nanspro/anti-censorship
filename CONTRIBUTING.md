# Local environment setup

- Clone the repository https://github.com/nanspro/anti-censorship

  ```bash
  git clone https://github.com/nanspro/anti-censorship
  ```

- Install dependencies

  ```bash
  cd anti-censorship
  yarn # (or npm install)
  ```

  Note: Make sure your node version is >= 12.1.0

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
