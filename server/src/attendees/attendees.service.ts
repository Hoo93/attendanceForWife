import { Injectable } from '@nestjs/common';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>,
  ) {}
  async createAttendee(
    createAttendeeDto: CreateAttendeeDto,
    user: User,
  ): Promise<Attendee> {
    const attendee = createAttendeeDto.toEntity();
    attendee.createId = user.id;

    const createdAttendee = await this.attendeeRepository.save(attendee);

    return createdAttendee;
  }

  async findAllByAttendanceId(
    attendanceId: string,
  ): Promise<[Attendee[], number]> {
    return this.attendeeRepository.findAndCount({
      where: { attendanceId: attendanceId },
    });
  }

  async findOneById(id: string) {
    return this.attendeeRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateAttendeeDto: UpdateAttendeeDto,
  ): Promise<Attendee> {
    await this.attendeeRepository.update({ id }, updateAttendeeDto);
    return this.findOneById(id);
  }

  remove(id: number) {
    return `This action removes a #${id} attendee`;
  }
}
