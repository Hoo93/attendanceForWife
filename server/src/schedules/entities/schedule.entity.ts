import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {BaseTimeEntity} from "../../BaseTimeEntity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Schedule extends BaseTimeEntity {
    @PrimaryGeneratedColumn('increment')
    @ApiProperty({ description: '출석대상의 출석 스케쥴' })
    id: number;

    @Column({ comment: '출석 대상 ID', type: 'varchar' })
    @ApiProperty({ description: '출석 대상 ID', type: 'string' })
    attendeeId: string;

    @Column({comment:'출석 요일',type:'enum'})
    @ApiProperty({description:'출석 요일',type:'enum'})
    day:string;

    @Column({ comment: '출석 시간', type: 'varchar' })
    @ApiProperty({ description: '출석 시간', type: 'string' })
    time: string;
}
