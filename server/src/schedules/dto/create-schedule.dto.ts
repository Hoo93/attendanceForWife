import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Schedule } from '../entities/schedule.entity';
import { SingleSchedule } from '../const/single-schedule.class';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석부 PK',
    type: 'string',
    example: 'uuid-1234-uuid',
  })
  attendanceId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석 대상 ID',
    type: 'string',
    example: 'uuid-1234-uuid',
  })
  attendeeId: string;

  @IsArray()
  @ApiProperty({ description: '출석 요일과 시간', type: Array.of(SingleSchedule) })
  singleSchedules: SingleSchedule[];

  toEntities(createId: string) {
    const schedules: Schedule[] = [];
    this.singleSchedules.forEach((singleSchedule) => {
      const schedule = new Schedule();
      schedule.attendeeId = this.attendeeId;
      schedule.day = singleSchedule.day;
      schedule.time = singleSchedule.time;
      schedule.createId = createId;
      schedules.push(schedule);
    });
    return schedules;
  }
}
