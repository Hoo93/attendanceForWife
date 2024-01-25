import { DayType } from '../const/day-type.enum';

export class ResponseScheduleDto {
  attendanceId: string;
  attendeeId: string;
  day: DayType;
  time: string;
}
