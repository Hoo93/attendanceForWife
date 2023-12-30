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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../common/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('attendances')
@ApiTags('출석부')
@ApiBearerAuth('token')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  createAttendance(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @GetUser() user: User,
  ) {
    return this.attendancesService.create(createAttendanceDto, user);
  }

  @Get()
  findAll() {
    return this.attendancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendancesService.findOne(+id);
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
