import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}
  create(createAttendanceDto: CreateAttendanceDto) {
    return 'This action adds a new attendance';
  }

  findAll() {
    return `This action returns all attendances`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendance`;
  }

  update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return `This action updates a #${id} attendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }
}
