import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석 대상 이름',
    type: 'string',
    example: 'attendee name',
  })
  name: string;

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
}
