'use client';

import React from 'react';

// Next
import Image from 'next/image';

// Styles
import { Colors, Icons, Images } from '@/styles/globalStyles';
import { AttendanceItemContainer } from '@/styles/app/listManagement.styles';

// Components
import DetailInputBox from '@/app/attendances/components/DetailInputBox';

// Types
import { AttendanceItemType } from '@/app/attendances/[id]/page';
import Icon from '@/components/Icon';

interface PropsType {
    index: number;
    item: AttendanceItemType;
    handleListItem: (
        index: number,
        field: string,
        value: string | boolean
    ) => void;
}

const AttendanceItem = (props: PropsType) => {
    const { item, index, handleListItem } = props;

    const statusIcons: { icon: string; count: number }[] = [
        { icon: 'sentiment_satisfied_alt', count: 10 },
        { icon: 'watch_later', count: 1 },
        { icon: 'highlight_off', count: 1 },
    ];

    return (
        <AttendanceItemContainer
            status={item.status}
            isDetailOpen={item.isDetailOpen}
            key={`attendance-item__${item.id}`}
        >
            <div className={'attendance-item__container'}>
                <div className="name">{item.name}</div>

                <div className={'bottom-container'}>
                    <div className={'days'}>월, 금</div>
                    <div className={'status-container'}>
                        {statusIcons.map((item) => (
                            <div className="status">
                                <Icon
                                    icon={Icons[item.icon]}
                                    color={Colors.Gray80}
                                    size={16}
                                />
                                <div className="count">{item.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 출석/지각/상세 사유 입력 박스 */}
            {/*<DetailInputBox*/}
            {/*    item={item}*/}
            {/*    index={index}*/}
            {/*    handleListItem={handleListItem}*/}
            {/*/>*/}
        </AttendanceItemContainer>
    );
};

export default AttendanceItem;
