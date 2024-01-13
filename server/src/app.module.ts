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
import { UserAttendance } from './attendances/entities/user-attendance.entity';
import { AttendeesModule } from './attendees/attendees.module';
import { SchedulesModule } from './schedules/schedules.module';
import { Schedule } from './schedules/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormConfigDevelopment,
      entities: [User, Role, Attendance, UserAttendance, Schedule],
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    AttendancesModule,
    AttendeesModule,
    SchedulesModule,
  ],
})
export class AppModule {}
