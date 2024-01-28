import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { User } from '../users/entities/user.entity';
import { Record } from './entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteRecordDto } from './dto/delete-record.dto';

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

  findAll() {
    return `This action returns all records`;
  }

  findOneById(id: number) {
    return this.recordRepository.findOneBy({ id });
  }

  update(id: number, updateRecordDto: UpdateRecordDto) {
    return `This action updates a #${id} record`;
  }

  deleteAll(deleteRecordDto: DeleteRecordDto) {
    return;
  }
}
