import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { jwtConstants } from './const/auth.const';
import { JwtPayload } from './const/jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signup(createAuthDto: CreateAuthDto): Promise<Partial<User>> {
    const user = createAuthDto.toEntity();
    await user.hashPassword();
    const { password, ...result } = await this.userRepository.save(user);
    return result;
  }

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({ relations: { userAttendance: true }, where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new BadRequestException('ID 또는 비밀번호가 정확하지 않습니다.');
  }

  async signin(signinDto: SigninDto) {
    const user = await this.validateUser(signinDto.username, signinDto.password);

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      userAttendance: user.userAttendance,
    };

    return {
      access_token: this.generateAccessToken(payload),
    };
  }

  public generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
    });
  }
}
