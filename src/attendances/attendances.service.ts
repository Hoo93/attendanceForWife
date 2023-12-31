import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserAttendance } from './entities/user-attendance.entity';
import { RoleType } from '../roles/role-type.enum';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(UserAttendance)
    private userAttendanceRepository: Repository<UserAttendance>,
  ) {}
  async create(createAttendanceDto: CreateAttendanceDto, user: User) {
    const attendance = createAttendanceDto.toEntity();
    attendance.createId = user.id;

    const newAttendance = await this.attendanceRepository.save(attendance);

    const newUserAttendance = new UserAttendance();
    newUserAttendance.attendanceId = newAttendance.id;
    newUserAttendance.userId = user.id;
    newUserAttendance.role = RoleType.ADMIN;
    newUserAttendance.createId = user.id;

    await this.userAttendanceRepository.save(newUserAttendance);

    return newAttendance;
  }

  async findAllByUserId(userId: string) {
    return this.userAttendanceRepository.find({
      select: { attendanceId: true, userId: true, role: true },
      where: { userId: userId },
      relations: { attendance: true },
    });
  }

  async findOneById(id: string) {
    return this.attendanceRepository.findOneBy({ id });
  }

  update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return `This action updates a #${id} attendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }
}
