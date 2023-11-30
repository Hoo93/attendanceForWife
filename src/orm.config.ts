import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  port: 3306,
  host: 'localhost',
  username: 'root',
  password: 'test',
  database: 'attendance_express',
  synchronize: true,
  logging: true,
  poolSize: 10,
  charset: 'utf8mb4',
  autoLoadEntities: true,
  entities: [User],
};
