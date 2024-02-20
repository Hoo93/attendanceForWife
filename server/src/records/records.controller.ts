import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, Response } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../common/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Attendee } from '../attendees/entities/attendee.entity';
import { Record } from './entities/record.entity';
import { RoleGuard } from '../roles/role.guard';
import { Roles } from '../roles/role.decorator';
import { RoleType } from '../roles/entities/role-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { CreateAttendeeDto } from '../attendees/dto/create-attendee.dto';
import { DeleteRecordDto } from './dto/delete-record.dto';
import { DeleteAttendeeDto } from '../attendees/dto/delete-attendee.dto';
import { CreateAllRecordDto } from './dto/createAll-record.dto';
import { RecordFilterDto } from './dto/record-filter.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('records')
@ApiTags('출석기록')
@ApiBearerAuth('token')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiOperation({
    description: '출석기록 생성 및 수정',
    summary: '출석기록 생성 및 수정',
  })
  @ApiBody({
    type: CreateRecordDto,
    description: '출석기록 생성 DTO',
  })
  @ApiResponse({
    status: 200,
    description: '출석기록 생성',
    type: Record,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL)
  async createRecord(@Body() createRecordDto: CreateRecordDto, @GetUser() user: User) {
    return this.recordsService.create(createRecordDto, user);
  }

  @Post('create')
  @ApiOperation({
    description: '선택한 날짜의 출석기록 일괄 생성',
    summary: '선택한 날짜의 출석기록 일괄 생성',
  })
  @ApiBody({
    type: CreateAllRecordDto,
    description: '출석기록 일괄 생성 DTO',
  })
  @ApiResponse({
    status: 200,
    description: '출석 기록 일괄 생성 후 affected Raws',
    type: Number,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL)
  async createAllRecord(@Body() createAllRecordDto: CreateAllRecordDto, @GetUser() user: User) {
    return this.recordsService.createAll(createAllRecordDto, user);
  }

  @Get(':id')
  @ApiOperation({
    description: '출석기록 ID로 조회',
    summary: '출석기록 ID로 조회',
  })
  @ApiResponse({
    status: 200,
    description: '출석기록 ID로 조회',
    type: Record,
  })
  findOne(@Param('id') id: string) {
    return this.recordsService.findOneById(+id);
  }

  @Get('attendee/:attendeeId')
  @ApiOperation({
    description: '출석대상에 속한 출석기록 조회',
    summary: '출석대상에 속한 출석기록 조회',
  })
  @ApiResponse({
    status: 200,
    description: '출석대상에 속한 출석기록 조회',
    type: Array<Record>,
  })
  async findByAttendeeId(
    @Param('attendeeId') attendeeId: string,
    @Query() recordFilterDto: RecordFilterDto,
  ): Promise<[Record[], number]> {
    return this.recordsService.findByAttendeeId(attendeeId, recordFilterDto);
  }

  @Get('attendance/:attendanceId')
  @ApiOperation({
    description: '출석부에 속한 출석기록 조회',
    summary: '출석부에 속한 출석기록 조회',
  })
  @ApiResponse({
    status: 200,
    description: '출석부에 속한 출석기록 조회',
    type: Array<Record>,
  })
  async findByAttendanceId(
    @Param('attendanceId') attendanceId: string,
    @Query() recordFilterDto: RecordFilterDto,
  ): Promise<[Record[], number]> {
    return this.recordsService.findByAttendanceId(attendanceId, recordFilterDto);
  }

  @Get('attendance/:attendanceId/excel')
  @ApiOperation({
    description: '출석부에 속한 출석기록 엑셀 다운로드',
    summary: '출석부에 속한 출석기록 엑셀 다운로드',
  })
  @ApiResponse({
    status: 200,
    description: '출석부에 속한 출석기록 엑셀 다운로드',
  })
  async downloadAttendanceRecordExcel(
    @Response() res,
    @Param('attendanceId') attendanceId: string,
    @Query() recordFilterDto: RecordFilterDto,
  ) {
    const buffer = await this.recordsService.excelDownload(attendanceId, recordFilterDto);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Members.xlsx"',
    });
    res.end(buffer);
  }

  @Get('attendee/:attendeeId/excel')
  @ApiOperation({
    description: '출석대상에 속한 출석기록 엑셀 다운로드',
    summary: '출석대상에 속한 출석기록 엑셀 다운로드',
  })
  @ApiResponse({
    status: 200,
    description: '출석대상에 속한 출석기록 엑셀 다운로드',
  })
  async downloadAttendeeRecordExcel(
    @Response() res,
    @Param('attendeeId') attendeeId: string,
    @Query() recordFilterDto: RecordFilterDto,
  ) {
    const buffer = await this.recordsService.attendeeRecordExcelDownload(attendeeId, recordFilterDto);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Members.xlsx"',
    });
    res.end(buffer);
  }

  @Delete()
  @ApiOperation({ summary: '출석기록 일괄 삭제' })
  @ApiBody({
    type: DeleteRecordDto,
    description: '출석기록 삭제 DTO',
  })
  @ApiResponse({
    status: 204,
    description: '출석기록 일괄 삭제',
    type: null,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER)
  deleteAll(@Body() deleteRecordDto: DeleteRecordDto) {
    return this.recordsService.deleteAll(deleteRecordDto);
  }
}
