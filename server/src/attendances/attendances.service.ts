import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Repository, UpdateResult } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity';
import { UserAttendance } from './entities/user-attendance.entity';
import { RoleType } from '../roles/entities/role-type.enum';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(UserAttendance)
    private userAttendanceRepository: Repository<UserAttendance>,
  ) {}
  async create(createAttendanceDto: CreateAttendanceDto, user: User): Promise<CommonResponseDto<any>> {
    const attendance = createAttendanceDto.toEntity();
    attendance.createId = user.id;

    const createdAttendance = await this.attendanceRepository.save(attendance);

    const userAttendance = new UserAttendance();
    userAttendance.attendanceId = createdAttendance.id;
    userAttendance.userId = user.id;
    userAttendance.role = RoleType.MASTER;
    userAttendance.createId = user.id;

    await this.userAttendanceRepository.save(userAttendance);

    return new CommonResponseDto('SUCCESS CREATE ATTENDANCE', { id: createdAttendance.id });
  }

  async findAllByUserId(userId: string): Promise<ResponseWithoutPaginationDto<UserAttendance>> {
    const [items, count] = await this.userAttendanceRepository
      .createQueryBuilder('userAttendance')
      .leftJoinAndSelect('userAttendance.attendance', 'attendance')
      .loadRelationCountAndMap('attendance.attendeeCount', 'attendance.attendees')
      .where('userAttendance.userId = :userId', { userId })
      .getManyAndCount();
    return new ResponseWithoutPaginationDto(count, items);
  }

  async findOneById(id: string): Promise<CommonResponseDto<Attendance>> {
    return new CommonResponseDto('SUCCESS FIND ATTENDANCE', await this.attendanceRepository.findOneBy({ id }));
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<CommonResponseDto<any>> {
    await this.attendanceRepository.update(id, updateAttendanceDto);
    return new CommonResponseDto('SUCCESS UPDATE ATTENDANCE');
  }

  async delete(attendanceId: string, userId: string): Promise<CommonResponseDto<any>> {
    await this.attendanceRepository.softDelete(attendanceId);
    await this.userAttendanceRepository.softDelete({ attendanceId, userId });
    return new CommonResponseDto('SUCCESS DELETE ATTENDANCE');
  }
}
