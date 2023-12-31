import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from '../common/pagination';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('회원')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '회원 전체 검색' })
  @ApiResponse({
    status: 201,
    description: '회원 전체 검색',
    type: User,
  })
  findAll(pagination: Pagination) {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 회원 검색' })
  @ApiResponse({
    status: 201,
    description: '회원 검색',
    type: User,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
