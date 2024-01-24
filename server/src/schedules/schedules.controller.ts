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
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { GetUser } from '../common/user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Attendee } from '../attendees/entities/attendee.entity';
import { CreateAttendeeDto } from '../attendees/dto/create-attendee.dto';
import { Schedule } from './entities/schedule.entity';

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

  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(+id);
  }

  @Get('/attendee/:attendeeId')
  @ApiOperation({ summary: '출석대상의 스케쥴 조회' })
  @ApiResponse({
    status: 200,
    description: '출석대상의 스케쥴 조회',
    type: Array<Schedule>,
  })
  findByAttendeeId(@Param('attendeeId') attendeeId: string) {
    return this.schedulesService.findByAttendeeId(attendeeId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
}
