import { User } from '../users/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

export class MockJwtService {
  public sign(payload:any,options){}
}
