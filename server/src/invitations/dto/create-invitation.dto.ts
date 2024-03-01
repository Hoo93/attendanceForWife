import { IsEnum } from 'class-validator';
import { AttendanceStatus } from '../../records/record-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../roles/entities/role-type.enum';

export class CreateInvitationDto {
  @IsEnum(RoleType)
  @ApiProperty({
    description: '출석 기록 상태',
    type: 'enum',
    enum: RoleType,
    example: RoleType.READER,
  })
  status: RoleType;
}
