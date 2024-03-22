import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../common/decorator/user.decorator';
import { Attendance } from './entities/attendance.entity';
import { UserAttendance } from './entities/user-attendance.entity';
import { RoleGuard } from '../roles/role.guard';
import { RoleType } from '../roles/entities/role-type.enum';
import { Roles } from '../roles/role.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { PageResponseDto } from '../common/response/pageResponse.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';

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
  createAttendance(@Body() createAttendanceDto: CreateAttendanceDto, @GetUser() user: User): Promise<CommonResponseDto<any>> {
    return this.attendancesService.create(createAttendanceDto, user);
  }

  @Get()
  @ApiOperation({ summary: '로그인한 회원의 출석부 목록 조회' })
  @ApiOkResponse({
    status: 200,
    description: '로그인한 회원의 출석부 목록 조회',
    type: UserAttendance,
  })
  findAllByUserId(@GetUser() user: User): Promise<ResponseWithoutPaginationDto<UserAttendance>> {
    return this.attendancesService.findAllByUserId(user.id);
  }

  @Get(':attendanceId')
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL, RoleType.READER)
  @ApiOperation({ summary: '출석부 상세 조회' })
  @ApiOkResponse({
    status: 200,
    description: '출석부 정보 수정',
    type: Attendance,
  })
  findOneById(@Param('attendanceId') attendanceId: string): Promise<CommonResponseDto<Attendance>> {
    return this.attendancesService.findOneById(attendanceId);
  }

  @Patch(':attendanceId')
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER)
  @ApiOperation({ summary: '출석부 정보 수정' })
  @ApiOkResponse({
    status: 200,
    description: '출석부 정보 수정',
    type: UpdateResult,
  })
  update(
    // RoleGuard 적용을 위해 attendanceId로 parameter 이름 지정
    @Param('attendanceId') attendanceId: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<CommonResponseDto<any>> {
    return this.attendancesService.update(attendanceId, updateAttendanceDto);
  }

  @Delete(':attendanceId')
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER)
  @ApiOperation({ summary: '출석부 삭제' })
  @ApiResponse({
    status: 204,
    description: '삭제 후 No Content 값 전달',
    type: null,
  })
  delete(@Param('attendanceId') attendanceId: string, @GetUser() user: User): Promise<CommonResponseDto<any>> {
    return this.attendancesService.delete(attendanceId, user.id);
  }
}
