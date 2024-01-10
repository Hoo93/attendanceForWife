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
import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
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
import { Attendance } from '../attendances/entities/attendance.entity';
import { CreateAttendanceDto } from '../attendances/dto/create-attendance.dto';
import { Attendee } from './entities/attendee.entity';
import { RoleGuard } from '../roles/role.guard';
import { Roles } from '../roles/role.decorator';
import { RoleType } from '../roles/entities/role-type.enum';

@UseGuards(AuthGuard('jwt'))
@Controller('attendees')
@ApiTags('출석 대상')
@ApiBearerAuth('access-token')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Post()
  @ApiOperation({ summary: '출석 대상 생성' })
  @ApiResponse({
    status: 200,
    description: '출석 대상 생성',
    type: Attendee,
  })
  @ApiBody({
    type: CreateAttendeeDto,
    description: '출석 대상 생성 DTO',
  })
  async create(
    @Body() createAttendeeDto: CreateAttendeeDto,
    @GetUser() user: User,
  ) {
    return this.attendeesService.createAttendee(createAttendeeDto, user);
  }

  @Get(':attendanceId')
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER)
  async findAllByAttendanceId(@Param('attendanceId') attendanceId: string) {
    console.log('ROLE GUARD SUCCESS');
    return this.attendeesService.findAllByAttendanceId(attendanceId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('SUCCESS');
    return this.attendeesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendeeDto: UpdateAttendeeDto,
  ) {
    return this.attendeesService.update(+id, updateAttendeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendeesService.remove(+id);
  }
}
