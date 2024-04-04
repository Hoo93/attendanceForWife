'use client';

import React from 'react';

// Next
import Image from 'next/image';

// Styles
import { Images } from '@/styles/globalStyles';
import {
    StatusButton,
    AttendanceItemContainer,
} from '@/styles/app/attendancesId.styles';

// Types
import { AttendanceItemType } from '@/app/attendances/[id]/page';
import DetailInputBox from '@/app/attendances/components/DetailInputBox';

interface PropsType {
    index: number;
    item: AttendanceItemType;
    handleClickDetail: (index: number, value: boolean) => void;
    handleClickStatus: (index: number, value: string) => void;
}

const AttendanceItem = (props: PropsType) => {
    const { item, index, handleClickDetail, handleClickStatus } = props;

    const statusButtons: { label: string; value: string }[] = [
        { label: '출석', value: '출석' },
        { label: '지각', value: '지각' },
        { label: '결석', value: '결석' },
    ];

    const detailOptions = {
        // TODO: api 연동 이후 영어로 변경 필요
        지각: [
            { label: '5분', value: '5' },
            { label: '10분', value: '10' },
            { label: '15분', value: '15' },
            { label: '20분 이상', value: '20' },
        ],
        결석: [
            { label: '공결', value: '5' },
            { label: '병결', value: '10' },
            { label: '무단', value: '15' },
            { label: '기타', value: '20' },
        ],
    };

    return (
        <AttendanceItemContainer
            status={item.status || '출석'}
            isDetailOpen={item.isDetailOpen}
            key={`attendance-item__${item.id}`}
        >
            <div className={'attendance-item__container'}>
                <div className="name">
                    {item.name}
                    <Image
                        src={Images.DetailOpen}
                        alt={`open-detail__${item.name}`}
                        onClick={() =>
                            handleClickDetail(index, item.isDetailOpen)
                        }
                    />
                </div>

                <div className="status-buttons">
                    {statusButtons.map((button) => (
                        <StatusButton
                            isSelected={item.status === button.value}
                            onClick={() =>
                                handleClickStatus(index, button.value)
                            }
                        >
                            {button.label}
                        </StatusButton>
                    ))}
                </div>
            </div>

            {/* 출석/지각/상세 사유 입력 박스 */}
            <DetailInputBox item={item} />
        </AttendanceItemContainer>
    );
};

export default AttendanceItem;
