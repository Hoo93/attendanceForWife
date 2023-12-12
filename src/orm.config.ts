import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  port: 3306,
  host: 'mysql-container',
  username: 'test_user',
  password: 'test_password',
  database: 'attendance',
  synchronize: true,
  logging: true,
  poolSize: 10,
  charset: 'utf8mb4',
  autoLoadEntities: true,
};
