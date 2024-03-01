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
import { DayType } from './const/day-type.enum';

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

  async findAllByAttendanceId(attendanceId: string): Promise<Schedule[]> {
    return await this.scheduleRepository.find({
      relations: {
        attendee: true,
      },
      where: {
        attendee: {
          attendanceId: attendanceId,
        },
      },
      select: {
        attendee: {
          attendanceId: true,
        },
      },
    });
  }

  async findTodayScheduleByAttendanceId(attendanceId: string, date = new Date()): Promise<Schedule[]> {
    const formattedDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
    const day = date.getDay().toString();

    const convertNumberToDay = (dayNumber) => {
      const days = [
        DayType.SUNDAY,
        DayType.MONDAY,
        DayType.TUESDAY,
        DayType.WEDNESDAY,
        DayType.THURSDAY,
        DayType.FRIDAY,
        DayType.SATURDAY,
      ];

      return days[dayNumber % 7];
    };

    const dayType = convertNumberToDay(day);

    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.attendee', 'attendee')
      .leftJoinAndSelect('attendee.records', 'records', 'records.date = :formattedDate', { formattedDate })
      .where('attendee.attendanceId = :attendanceId', { attendanceId })
      .andWhere('schedule.day = :day', { day: dayType })
      .select([
        'schedule', // 필요한 schedule 필드 선택
        'attendee.attendanceId',
        'records', // 필요한 records 필드 선택
      ])
      .getMany();
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
