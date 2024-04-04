import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class MultiIdsResponseDto {
  @ApiProperty({ description: 'PK', type: 'array' })
  @IsArray()
  ids: any;
}
