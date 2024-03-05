import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Repository, UpdateResult } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserAttendance } from './entities/user-attendance.entity';
import { RoleType } from '../roles/entities/role-type.enum';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from '../auth/const/jwtPayload.interface';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(UserAttendance)
    private userAttendanceRepository: Repository<UserAttendance>,
    private authService: AuthService,
  ) {}
  async create(createAttendanceDto: CreateAttendanceDto, user: User) {
    const attendance = createAttendanceDto.toEntity();
    attendance.createId = user.id;

    const createdAttendance = await this.attendanceRepository.save(attendance);

    const newUserAttendance = new UserAttendance();
    newUserAttendance.attendanceId = createdAttendance.id;
    newUserAttendance.userId = user.id;
    newUserAttendance.role = RoleType.MASTER;
    newUserAttendance.createId = user.id;

    const createdUserAttendance = await this.userAttendanceRepository.save(newUserAttendance);

    !!user.userAttendance ? user.userAttendance.push(createdUserAttendance) : (user.userAttendance = [createdUserAttendance]);

    const jwtPayload: JwtPayload = {
      id: user.id,
      username: user.username,
      userAttendance: user.userAttendance,
    };

    return {
      result: createdAttendance,
      access_token: this.authService.generateAccessToken(jwtPayload),
    };
  }

  async findAllByUserId(userId: string): Promise<any> {
    return this.userAttendanceRepository
      .createQueryBuilder('userAttendance')
      .leftJoinAndSelect('userAttendance.attendance', 'attendance')
      .loadRelationCountAndMap('attendance.attendeeCount', 'attendance.attendees')
      .where('userAttendance.userId = :userId', { userId })
      .getMany();
  }

  async findOneById(id: string) {
    return this.attendanceRepository.findOneBy({ id });
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<UpdateResult> {
    const result = await this.attendanceRepository.update(id, updateAttendanceDto);
    return result;
  }

  async delete(attendanceId: string, userId: string) {
    await this.attendanceRepository.softDelete(attendanceId);
    await this.userAttendanceRepository.softDelete({ attendanceId, userId });
    return;
  }
}
