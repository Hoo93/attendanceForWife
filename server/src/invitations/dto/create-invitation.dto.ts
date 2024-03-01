import { IsEnum, IsString } from 'class-validator';
import { AttendanceStatus } from '../../records/record-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../roles/entities/role-type.enum';

export class CreateInvitationDto {
  @IsEnum(RoleType)
  @ApiProperty({
    description: '선택 권한으로 출석부에 초대',
    type: 'enum',
    enum: RoleType,
    example: RoleType.READER,
  })
  status: RoleType;

  @IsString()
  @ApiProperty({
    description: '초대할 출석부의 ID',
    type: 'string',
    example: 'attendance-uuid',
  })
  attendanceId: string;
}
