import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: '로그인 ID',
    type: 'string',
    example: 'testID',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: '회원 비밀번호',
    type: 'string',
    example: 'pwd123!@#',
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    description: '자동로그인 여부',
    type: 'boolean',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isAutoLogin?: boolean;
}
