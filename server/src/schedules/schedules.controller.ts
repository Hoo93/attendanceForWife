import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { GetUser } from '../common/user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Attendee } from '../attendees/entities/attendee.entity';
import { CreateAttendeeDto } from '../attendees/dto/create-attendee.dto';
import { Schedule } from './entities/schedule.entity';
import { ScheduleFilterDto } from './dto/schedule-filter.dto';
import { DeleteScheduleDto } from './dto/delete-schedule.dto';

@Controller('schedules')
@UseGuards(AuthGuard('jwt'))
@ApiTags('출석 스케쥴')
@ApiBearerAuth('token')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @ApiOperation({ summary: '출석 스케쥴 생성' })
  @ApiResponse({
    status: 200,
    description: '출석 스케쥴 생성',
    type: Schedule,
  })
  @ApiBody({
    type: CreateScheduleDto,
    description: '출석 스케쥴 생성 DTO',
  })
  create(@Body() createScheduleDto: CreateScheduleDto, @GetUser() user: User) {
    return this.schedulesService.create(createScheduleDto, user);
  }

  @Get('/attendee/:attendeeId')
  @ApiOperation({ summary: '출석대상의 스케쥴 조회' })
  @ApiResponse({
    status: 200,
    description: '출석대상의 스케쥴 조회',
    type: Array<Schedule>,
  })
  findByAttendeeId(@Param('attendeeId') attendeeId: string): Promise<Schedule[]> {
    return this.schedulesService.findByAttendeeId(attendeeId);
  }

  @Get('/attendanceId/:attendanceId/today')
  @ApiOperation({ summary: '해당 출석부의 오늘의 스케쥴과 출석내역 조회' })
  @ApiResponse({
    status: 200,
    description: '해당 출석부의 오늘의 스케쥴과 출석내역 조회',
    type: Array<Schedule>,
  })
  findTodayScheduleByAttendanceId(
    @Param('attendanceId') attendanceId: string,
    @Query() scheduleFilterDto: ScheduleFilterDto,
  ): Promise<Schedule[]> {
    return this.schedulesService.findTodayScheduleByAttendanceId(attendanceId);
  }

  @Get('/attendanceId/:attendanceId')
  @ApiOperation({ summary: '출석부에 속한 모든 스케쥴 조회' })
  @ApiResponse({
    status: 200,
    description: '출석부에 속한 모든 스케쥴 조회',
    type: Array<Schedule>,
  })
  findByAttendanceId(@Param('attendanceId') attendanceId: string, @Query() scheduleFilterDto: ScheduleFilterDto): Promise<Schedule[]> {
    return this.schedulesService.findAllByAttendanceId(attendanceId);
  }

  @Delete()
  @ApiOperation({ summary: '스케쥴 일괄 삭제' })
  @ApiResponse({
    status: 200,
    description: '스케쥴 일괄 삭제',
    type: null,
  })
  deleteAll(@Body() deleteScheduleDto: DeleteScheduleDto) {
    return this.schedulesService.deleteAll(deleteScheduleDto);
  }
}
