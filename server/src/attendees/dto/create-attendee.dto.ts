import { IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Attendance } from '../../attendances/entities/attendance.entity';
import { Attendee } from '../entities/attendee.entity';
import { INVALID_MOBILENUMBER_MESSAGE } from '../../auth/const/error-message';
import { MobileNumberTransform } from '../../common/decorator/phoneNumber.decorator';

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

  @IsString()
  @Matches(/^01[01]{1}\d{7,8}$/, {
    message: INVALID_MOBILENUMBER_MESSAGE,
  })
  @MobileNumberTransform()
  @IsOptional()
  @ApiProperty({
    description: '출석 대상 전화번호',
    type: 'string',
    example: '01012345678',
  })
  mobileNumber: string;

  @IsString()
  @Matches(/^01[01]{1}\d{7,8}$/, {
    message: INVALID_MOBILENUMBER_MESSAGE,
  })
  @MobileNumberTransform()
  @IsOptional()
  @ApiProperty({
    description: '출석 대상 비상 전화번호',
    type: 'string',
    example: '01012345678',
  })
  subMobileNumber: string;

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
    attendee.mobileNumber = this.mobileNumber;
    attendee.subMobileNumber = this.subMobileNumber;
    attendee.description = this?.description;
    attendee.age = this?.age;
    return attendee;
  }
}
