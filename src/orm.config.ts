import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  port: 11100,
  host: 'localhost',
  username: 'root',
  password: 'test',
  database: 'sys',
  synchronize: true,
  logging: true,
  poolSize: 10,
  charset: 'utf8mb4',
  autoLoadEntities: true,
};
