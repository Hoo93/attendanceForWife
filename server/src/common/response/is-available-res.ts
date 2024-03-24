import { ApiProperty } from '@nestjs/swagger';

export class AvailabilityResult {
  @ApiProperty({ description: '성공여부', type: 'boolean', example: true })
  isAvailable: boolean;

  constructor(isAvailable: boolean) {
    this.isAvailable = isAvailable;
  }
}
