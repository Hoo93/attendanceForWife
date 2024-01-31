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

  async createAll(createAllrecordDto: CreateAllRecordDto, user: User): Promise<number> {
    const result = await this.recordRepository.query(
      `
    INSERT INTO record (attendeeId,status,date,day,createId)
    SELECT atd.id,?,?,?,?
    FROM attendee as atd
    LEFT JOIN record r ON r.attendeeId = atd.id AND r.date = ?
    WHERE atd.attendanceId = ? AND atd.deletedAt IS NULL AND r.id IS NULL;`,
      [
        createAllrecordDto.status,
        createAllrecordDto.date,
        createAllrecordDto.day,
        user.id,
        createAllrecordDto.date,
        createAllrecordDto.attendanceId,
      ],
    );
    return result.affectedRows;
  }

  private getDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();

    // 한 자리수 월과 일에 선행하는 0 추가
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    // YYYY-MM-DD 형식으로 변환
    return `${year}-${formattedMonth}-${formattedDay}`;
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
