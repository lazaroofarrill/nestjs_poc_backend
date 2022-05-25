const config = require('dotenv').config

const SnakeNamingStrategy =
  require('typeorm-naming-strategies').SnakeNamingStrategy

config()
module.exports = {
  namingStrategy: new SnakeNamingStrategy(),
  type: process.env.RDBMS_CONNECTION,
  host: process.env.RDBMS_HOST,
  port: process.env.RDBMS_PORT,
  username: process.env.RDBMS_USERNAME,
  password: process.env.RDBMS_PASSWORD,
  database: process.env.RDBMS_DATABASE,
  synchronize: process.env.RDBMS_SYNCHRONIZE === 'true',
  logging: process.env.RDBMS_LOGGING === 'true',
  migrationsRun: process.env.RDBMS_MIGRATIONS_RUN === 'true',
  entities: ['dist/**/entities/*.js', 'dist/src/**/*.entity.js'],
  migrations: ['dist/common/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/common/database/migrations',
  },
}
