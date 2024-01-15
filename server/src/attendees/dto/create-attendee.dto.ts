import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Attendance } from '../../attendances/entities/attendance.entity';
import { Attendee } from '../entities/attendee.entity';

export class CreateAttendeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석 대상 이름',
    type: 'string',
    example: 'attendee name',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석부 ID',
    type: 'string',
    example: 'attendanceId',
  })
  attendanceId: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: '출석 대상 나이',
    type: 'int',
    example: 15,
  })
  age: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '출석 대상 설명',
    type: 'string',
    example: 'attendee description',
  })
  description: string;

  createId: string;

  createdAt: string;

  toEntity() {
    const attendee = new Attendee();
    attendee.name = this.name;
    attendee.attendanceId = this.attendanceId;
    attendee.description = this?.description;
    attendee.age = this?.age;
    return attendee;
  }
}
