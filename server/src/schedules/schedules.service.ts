import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { isNumber } from 'class-validator';
import { Attendee } from '../attendees/entities/attendee.entity';
import { ResponseScheduleDto } from './dto/response-schedule.dto';
import { Attendance } from '../attendances/entities/attendance.entity';
import { DeleteAttendeeDto } from '../attendees/dto/delete-attendee.dto';
import { DeleteScheduleDto } from './dto/delete-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto, user: User): Promise<Schedule> {
    const schedule = createScheduleDto.toEntity(user.id);

    if (!this.verifyAttendTime(schedule.time)) {
      throw new BadRequestException('유효하지 않은 시간 포맷입니다.');
    }
    return this.scheduleRepository.save(schedule);
  }

  async findByAttendeeId(attendeeId: string): Promise<Schedule[]> {
    return await this.scheduleRepository.findBy({
      attendeeId,
    });
  }

  async findByAttendanceId(attendanceId: string, date = new Date()): Promise<Schedule[]> {
    return await this.scheduleRepository.find({
      relations: {
        attendee: {
          records: true,
        },
      },
      where: {
        attendee: {
          attendanceId: attendanceId,
        },
      },
      select: {
        attendee: {
          attendanceId: true,
          records: true,
        },
      },
    });
  }

  async deleteAll(deleteScheduleDto: DeleteScheduleDto) {
    await this.scheduleRepository.softDelete({
      id: In(deleteScheduleDto.ids),
    });
    return;
  }

  private verifyAttendTime(time: string) {
    if (typeof time !== 'string' || time.length !== 4) {
      return false;
    }
    const hour = time.slice(0, time.length - 2);
    const minute = time.slice(time.length - 2);

    return !(parseInt(hour) >= 24 || parseInt(minute) >= 60);
  }
}
