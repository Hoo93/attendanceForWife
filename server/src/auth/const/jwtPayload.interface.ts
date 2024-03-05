import { UserAttendance } from '../../attendances/entities/user-attendance.entity';

export interface JwtPayload {
  id: string;
  username: string;
  userAttendance: UserAttendance[];
}
