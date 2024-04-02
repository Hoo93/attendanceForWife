import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { jwtConstants } from './const/auth.const';
import { JwtPayload } from './const/jwtPayload.interface';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { LoginHistory } from './entity/login-history.entity';
import { AvailabilityResult } from '../common/response/is-available-res';
import { ELoginType } from './const/Elogin-type.enum';
import { isBoolean } from 'class-validator';
import { LoginType } from './const/login-type.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(LoginHistory) private loginHistoryRepository: Repository<LoginHistory>,
    private jwtService: JwtService,
  ) {}
  public async signup(createAuthDto: CreateAuthDto): Promise<CommonResponseDto<User>> {
    const user = createAuthDto.toEntity();
    await user.hashPassword();
    const result = await this.userRepository.save(user);

    delete result.password;

    return new CommonResponseDto('SUCCESS SIGNUP', result);
  }

  public async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({
      relations: { userAttendance: true },
      where: { loginType: LoginType.GENERAL, username },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new BadRequestException('ID 또는 비밀번호가 정확하지 않습니다.');
  }

  public async validateKakaoUser(profile: any) {
    const user = await this.userRepository.findOne({
      relations: { userAttendance: true },
      where: { loginType: LoginType.KAKAO, kakaoId: profile.id },
    });
    if (user) {
      return user;
    }

    const whereOption = [];
    if (profile._json.kakao_account.phone_number) {
      whereOption.push({ mobileNumber: this.transformMobileNumber(profile._json.kakao_account.phone_number) });
    }
    if (profile._json.kakao_account.email) {
      whereOption.push({ email: profile._json.kakao_account.email });
    }
    if (whereOption.length >= 0) {
      const found = await this.userRepository.findOneBy(whereOption);
      if (found) {
        throw new BadRequestException('이미 가입된 정보가 존재합니다.');
      }
    }

    // 중복 회원이 없는 경우 회원가입
    const newUser = new User();
    newUser.loginType = LoginType.KAKAO;
    newUser.kakaoId = profile.id;
    newUser.name = profile?.displayName;
    newUser.mobileNumber = profile._json.kakao_account?.phone_number;
    newUser.email = profile._json.kakao_account?.email;
    newUser.createId = profile.id;

    const createdUser = await this.userRepository.save(newUser);
  }

  public async signIn(signInDto: SignInDto, ip: string, loginAt: Date = new Date()): Promise<CommonResponseDto<TokenResponseDto>> {
    const user = await this.validateUser(signInDto.username, signInDto.password);

    const payload: JwtPayload = {
      id: user.id,
      userType: user.type,
      userAttendance: user.userAttendance,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload, signInDto.isAutoLogin);

    await this.saveRefreshToken(user.id, refreshToken);

    await this.createLoginHistory(user.id, ip, loginAt);

    await this.userRepository.update(user.id, { isAutoLogin: signInDto.isAutoLogin ?? false });

    return new CommonResponseDto('SUCCESS SIGN IN', new TokenResponseDto(accessToken, refreshToken));
  }

  async kakaoSignIn(user: User, ip: string, loginAt: Date = new Date()): Promise<CommonResponseDto<TokenResponseDto>> {
    const payload: JwtPayload = {
      id: user.id,
      userType: user.type,
      userAttendance: user.userAttendance,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload, false);

    await this.saveRefreshToken(user.id, refreshToken);

    await this.createLoginHistory(user.id, ip, loginAt);

    await this.userRepository.update(user.id, { isAutoLogin: false });

    return new CommonResponseDto('SUCCESS KAKAO SIGN IN', new TokenResponseDto(accessToken, refreshToken));
  }

  public async refreshToken(oldRefreshToken: string, ip: string): Promise<CommonResponseDto<TokenResponseDto>> {
    const decoded: JwtPayload = this.verifyRefreshToken(oldRefreshToken);

    const recentLoginHistory = await this.loginHistoryRepository.findOne({
      relations: {
        user: {
          userAttendance: true,
        },
      },
      where: { userId: decoded.id },
      order: { loginAt: 'DESC' },
    });

    if (!recentLoginHistory?.user || recentLoginHistory?.user.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedException('리프레시토큰이 유효하지 않습니다.');
    }

    if (!recentLoginHistory || recentLoginHistory.currentIp !== ip) {
      throw new UnauthorizedException('마지막으로 로그인 한 기기가 아닙니다.');
    }

    const jwtPayload: JwtPayload = {
      id: recentLoginHistory.user.id,
      userType: recentLoginHistory.user.type,
      userAttendance: recentLoginHistory.user.userAttendance,
    };

    const newAccessToken = this.generateAccessToken(jwtPayload);
    const newRefreshToken = this.generateRefreshToken(jwtPayload, recentLoginHistory.user.isAutoLogin);

    await this.saveRefreshToken(recentLoginHistory.user.id, newRefreshToken);

    return new CommonResponseDto('SUCCESS REFRESH TOKEN', new TokenResponseDto(newAccessToken, newRefreshToken));
  }

  public async isAvailableEmail(email: string) {
    const found = await this.userRepository.findOneBy({ email });

    return new CommonResponseDto('Email Valid check success', new AvailabilityResult(!!!found));
  }
  public async isAvailableMobileNumber(mobileNumber: string): Promise<CommonResponseDto<AvailabilityResult>> {
    const found = await this.userRepository.findOneBy({ mobileNumber });
    return new CommonResponseDto('', new AvailabilityResult(!!!found));
  }

  public async isAvailableUsername(username: string): Promise<CommonResponseDto<AvailabilityResult>> {
    const found = await this.userRepository.findOneBy({ username });
    return new CommonResponseDto('', new AvailabilityResult(!!!found));
  }

  private generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: jwtConstants.accessTokenExpiresIn,
    });
  }

  private generateRefreshToken(payload: JwtPayload, isAutoLogin: boolean) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: isAutoLogin ? jwtConstants.autoLoginRefreshTokenExpiresIn : jwtConstants.refreshTokenExpiresIn,
    });
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    await this.userRepository.update(userId, { refreshToken });
  }

  private verifyRefreshToken(oldRefreshToken: string) {
    try {
      return this.jwtService.verify(oldRefreshToken, { secret: jwtConstants.refreshTokenSecret });
    } catch (err) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
  }

  private async createLoginHistory(userId: string, ip: string, loginAt: Date): Promise<null> {
    const loginHistory = new LoginHistory();
    loginHistory.userId = userId;
    loginHistory.currentIp = ip;
    loginHistory.loginAt = loginAt;

    await this.loginHistoryRepository.insert(loginHistory);
    return;
  }

  private transformMobileNumber(mobileNumber: string): string {
    return '0' + mobileNumber.replaceAll('-', '').split(' ')[1];
  }
}
