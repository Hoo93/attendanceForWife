import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async signup(createAuthDto: CreateAuthDto): Promise<Partial<User>> {
    const user = createAuthDto.toEntity();
    const { password, ...result } = await this.userRepository.save(user);
    return result;
  }

  async validateUser(id: string, password: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
  }
}
