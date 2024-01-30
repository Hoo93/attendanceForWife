import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { User } from '../users/entities/user.entity';
import { Record } from './entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DeleteRecordDto } from './dto/delete-record.dto';
import { CreateAllRecordDto } from './dto/createAll-record.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}
  async create(createRecordDto: CreateRecordDto, user: User) {
    const record = createRecordDto.toEntity(user.id);

    const result = await this.recordRepository.upsert(record, {
      conflictPaths: ['attendeeId', 'date'],
      upsertType: 'on-conflict-do-update',
    });

    return this.findOneById(result.raw.id);
  }

  async createAll(createAllrecordDto: CreateAllRecordDto) {
    return;
  }

  findOneById(id: number) {
    return this.recordRepository.findOneBy({ id });
  }

  update(id: number, updateRecordDto: UpdateRecordDto) {
    return `This action updates a #${id} record`;
  }

  async deleteAll(deleteRecordDto: DeleteRecordDto) {
    const found = await this.recordRepository.find({
      where: {
        attendee: { attendanceId: deleteRecordDto.attendanceId },
        id: In(deleteRecordDto.ids),
      },
    });

    const filteredRecord = found.filter((record) => {
      return deleteRecordDto.ids.includes(record.id);
    });

    if (filteredRecord.length !== deleteRecordDto.ids.length) {
      throw new BadRequestException(
        `AttendanceId : ${deleteRecordDto.attendanceId} 에 속한 기록만 삭제할 수 있습니다..`,
      );
    }

    await this.recordRepository.softDelete({
      id: In(deleteRecordDto.ids),
    });
    return;
  }
}
