import { UserAttendance } from '../../attendances/entities/user-attendance.entity';
import { UserType } from '../../users/const/user-type.enum';

export interface JwtPayload {
  id: string;
  username: string;
  userType: UserType;
  userAttendance: UserAttendance[];
}
