import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfigTest } from './orm.config';
import { User } from './users/entities/user.entity';
import { Attendance } from './attendances/entities/attendance.entity';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { AttendancesModule } from './attendances/attendances.module';
import { UserAttendance } from './attendances/entities/user-attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormConfigTest,
      entities: [User, Role, Attendance, UserAttendance],
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    AttendancesModule,
  ],
})
export class TestModule {}
