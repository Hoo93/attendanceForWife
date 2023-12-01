import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

@Controller('auth')
@ApiTags('인증')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({
    status: 201,
    description: '회원 가입',
    type: User,
  })
  @ApiBody({
    type: CreateAuthDto,
    description: '회원 가입 DTO',
  })
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signup(createAuthDto);
  }
}
