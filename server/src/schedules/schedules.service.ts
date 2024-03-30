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
import { CommonResponseDto } from '../common/response/common-response.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto, user: User): Promise<CommonResponseDto<{ ids: number[] }>> {
    const schedules = createScheduleDto.toEntities(user.id);

    if (!schedules.some((schedule) => this.verifyAttendTime(schedule.time))) {
      throw new BadRequestException('유효하지 않은 시간 포맷입니다.');
    }
    const createdResponse = await this.scheduleRepository.save(schedules);

    return new CommonResponseDto('SUCCESS CREATE SCHEDULES', { ids: createdResponse.map((schedule) => schedule.id) });
  }

  async findByAttendeeId(attendeeId: string): Promise<ResponseWithoutPaginationDto<Schedule>> {
    const [items, count] = await this.scheduleRepository.findAndCountBy({
      attendeeId,
    });

    return new ResponseWithoutPaginationDto(count, items);
  }

  async findAllByAttendanceId(attendanceId: string): Promise<ResponseWithoutPaginationDto<Schedule>> {
    const [items, count] = await this.scheduleRepository.findAndCount({
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

    return new ResponseWithoutPaginationDto(count, items);
  }

  async findTodayScheduleByAttendanceId(attendanceId: string, date = new Date()): Promise<ResponseWithoutPaginationDto<Schedule>> {
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

    const [items, count] = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.attendee', 'attendee')
      .leftJoinAndSelect('attendee.records', 'records', 'records.date = :formattedDate', { formattedDate })
      .where('attendee.attendanceId = :attendanceId', { attendanceId })
      .andWhere('schedule.day = :day', { day: dayType })
      .select([
        'schedule', // 필요한 schedule 필드 선택
        'attendee',
        'records', // 필요한 records 필드 선택
      ])
      .orderBy('schedule.time , attendee.name', 'ASC')
      .getManyAndCount();

    return new ResponseWithoutPaginationDto(count, items);
  }

  async deleteAll(deleteScheduleDto: DeleteScheduleDto): Promise<CommonResponseDto<any>> {
    await this.scheduleRepository.softDelete({
      id: In(deleteScheduleDto.ids),
    });
    return new CommonResponseDto('SUCCESS DELETE SCHEDULES');
  }

  private verifyAttendTime(time: string) {
    const timeStringLength = 4;
    if (time.length !== timeStringLength) {
      return false;
    }
    const hour = time.slice(0, 2);
    const minute = time.slice(2);

    return !(parseInt(hour) >= 24 || parseInt(minute) >= 60);
  }
}
