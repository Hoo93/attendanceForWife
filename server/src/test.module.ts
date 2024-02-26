import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Attendance } from './attendances/entities/attendance.entity';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { AttendancesModule } from './attendances/attendances.module';
import { UserAttendance } from './attendances/entities/user-attendance.entity';
import { Attendee } from './attendees/entities/attendee.entity';
import { AttendeesModule } from './attendees/attendees.module';
import { SchedulesModule } from './schedules/schedules.module';
import { Schedule } from './schedules/entities/schedule.entity';
import { Record } from './records/entities/record.entity';
import { RecordsModule } from './records/records.module';
import { ConfigModule } from '@nestjs/config';
import { getOrmConfig } from './orm.config';
import { Invitation } from './invitations/entities/invitation.entity';
import { InvitationsModule } from './invitations/invitations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.test`,
    }),
    TypeOrmModule.forRoot({
      ...getOrmConfig(),
      entities: [User, Role, Attendance, UserAttendance, Attendee, Schedule, Record, Invitation],
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    AttendancesModule,
    AttendeesModule,
    SchedulesModule,
    RecordsModule,
    InvitationsModule,
  ],
})
export class TestModule {}
