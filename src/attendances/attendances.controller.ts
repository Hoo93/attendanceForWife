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
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../common/user.decorator';
import { Attendance } from './entities/attendance.entity';
import { UserAttendance } from './entities/user-attendance.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('attendances')
@ApiTags('출석부')
@ApiBearerAuth('token')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @ApiOperation({ summary: '출석부 생성' })
  @ApiResponse({
    status: 200,
    description: '출석부 생성',
    type: Attendance,
  })
  @ApiBody({
    type: CreateAttendanceDto,
    description: '출석부 생성 DTO',
  })
  createAttendance(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @GetUser() user: User,
  ) {
    return this.attendancesService.create(createAttendanceDto, user);
  }

  @Get()
  @ApiOperation({ summary: '로그인한 회원의 출석부 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '로그인한 회원의 출석부 목록 조회',
    type: UserAttendance,
  })
  findAllByUserId(@GetUser() user: User) {
    return this.attendancesService.findAllByUserId(user.id);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.attendancesService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendancesService.update(+id, updateAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendancesService.remove(+id);
  }
}
