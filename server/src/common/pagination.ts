import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class Pagination {
  @ApiProperty({
    type: 'number',
    description: '스킵할 개수',
    default: 0,
  })
  @IsNumber()
  @Min(0)
  skip: number = 0;

  @ApiProperty({
    type: 'number',
    description: '가지고 올 개수',
    default: 10,
  })
  @IsPositive()
  @Max(100)
  take: number = 10;
}
