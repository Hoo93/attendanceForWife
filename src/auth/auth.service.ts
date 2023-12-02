import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async signup(createAuthDto: CreateAuthDto): Promise<Partial<User>> {
    const user = createAuthDto.toEntity();
    await user.hashPassword();
    const { password, ...result } = await this.userRepository.save(user);
    return result;
  }

  async validateUser(id: string, password: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user && (await bcrypt.compare(user.password, password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new BadRequestException('ID 또는 비밀번호가 정확하지 않습니다.');
  }
}
