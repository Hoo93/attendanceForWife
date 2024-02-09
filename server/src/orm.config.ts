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

export const ormConfigDevelopment: TypeOrmModuleOptions = {
  type: 'mysql',
  port: 12300,
  host: 'localhost',
  username: 'test_user',
  password: 'test_password',
  database: 'attendance',
  synchronize: true,
  logging: true,
  poolSize: 10,
  charset: 'utf8mb4',
  autoLoadEntities: true,
};

export const ormConfigTest: TypeOrmModuleOptions = {
  type: 'mysql',
  port: 12300,
  host: 'localhost',
  username: 'root',
  password: 'test',
  database: 'attendanceTest',
  synchronize: true,
  logging: true,
  poolSize: 10,
  charset: 'utf8mb4',
  autoLoadEntities: true,
};
