import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  port: 3306,
  host: 'localhost',
  username: 'root',
  password: 'test',
  database: 'attendance',
  synchronize: true,
  logging: true,
  poolSize: 10,
  charset: 'utf8mb4',
};
