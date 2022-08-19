## About
-  Dev @flabastida
-  Project wordle game backend for DD3 test
### Technologies

* [Nodejs](https://nodejs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [Expresss](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/)

## Start the project

```bash
# install dependencies
$ npm i

# serve production build - Start game
$ npm start

# Only build
$ npm run build

# Server for dev in hot reload
$ npm run dev

# Test
$ npm run test

#Test coverage
$ npm run test:coverage
```

## Set up the .env
 ```bash
PORT=4000
# Secret token for auth
SECRET_TOKEN=secretToken
# DB connection
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=example
DB_PASSWORD=examplePassword
DB_NAME=exampleDB
 ```

 ### Set up the .env for testing and dev
 ```bash
 # test
SECRET_TOKEN_TEST=secretToken
DB_HOST_TEST=localhost
DB_PORT_TEST=5432
DB_USERNAME_TEST=test
DB_PASSWORD_TEST=examplePassword
DB_NAME_TEST=exampleDB-test
USERNAME_TEST=user@test.dev
PASSWORD_TEST=passwordTest
#dev
SECRET_TOKEN_DEV=secretToken
DB_HOST_DEV=localhost
DB_PORT_DEV=5432
DB_USERNAME_DEV=test@test.dev
DB_PASSWORD_DEV=passwordDBDev
DB_NAME_DEV=exampleDB-dev
 ```

 ## How to play
 ### Register
 * Method: POST
 * Edpoint: /api/users/
 * Body 
```
   {
      username: username,
      password: password
    }
```
 ### Login
 * Method: POST
 * Edpoint: /api/users/login
 * Body 
```
   {
      username: username,
      password: password
    }
```
 * response
 ```
{
  token: token,
  message: message
 }
 ```
 ### Play Game
 * Method: POST
 * Endpoint: /api/game/word
 * Body 
 ```
{
  user_word: 'fooba'
 }
 ```
 * headers: [x-access-token]
 ### User stats
 * Method: GET
 * Endpoint: /api/user/stats
 * headers: [x-access-token] token of response in login
 ### Top ten users
 * Method: GET
 * Endpoint: /api/user/top-ten
 * headers: [x-access-token] token of response in login
 ### Words stats
 * Method: GET
 * Endpoint: /api/game/top-words
 * headers: [x-access-token] token of response in login