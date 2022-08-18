const NODE_ENV: string | undefined = process.env.NODE_ENV
interface configSet {
  PORT: string | undefined | number
  SECRET: string | undefined
  DB_HOST: string | undefined
  DB_PORT: string | undefined
  DB_USERNAME: string | undefined
  DB_PASSWORD: string | undefined
  DB_NAME: string | undefined
}
let configSetup: configSet
if (NODE_ENV === 'test') {
  configSetup = {
    // Server config for testing
    PORT: process.env.PORT,
    SECRET: process.env.SECRET_TOKEN_TEST,
    DB_HOST: process.env.DB_HOST_TEST,
    DB_PORT: process.env.DB_PORT_TEST,
    DB_USERNAME: process.env.DB_USERNAME_TEST,
    DB_PASSWORD: process.env.DB_PASSWORD_TEST,
    DB_NAME: process.env.DB_NAME_TEST
  }
} else if (NODE_ENV === 'dev') {
  configSetup = {
    // Server config for development
    PORT: process.env.PORT,
    SECRET: process.env.SECRET_TOKEN_DEV,
    DB_HOST: process.env.DB_HOST_DEV,
    DB_PORT: process.env.DB_PORT_DEV,
    DB_USERNAME: process.env.DB_USERNAME_DEV,
    DB_PASSWORD: process.env.DB_PASSWORD_DEV,
    DB_NAME: process.env.DB_NAME_DEV
  }
} else {
  configSetup = {
    // Server config for production
    PORT: process.env.PORT,
    SECRET: process.env.SECRET_TOKEN,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME
  }
}
export default configSetup
