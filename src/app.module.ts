import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig, ormConfigDevelopment } from './orm.config';
import { User } from './users/entities/user.entity';
import { Attendance } from './attendances/entities/attendance.entity';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { AttendancesModule } from './attendances/attendances.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormConfig,
      entities: [User, Role, Attendance],
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    AttendancesModule,
  ],
})
export class AppModule {}
