'use client';

import React, { useState } from 'react';

// Next
import { usePathname } from 'next/navigation';

// Api
import { useQuery } from '@tanstack/react-query';
import AttendanceApiClient from '@/api/AttendanceApiClient';

// Styles
import { Colors, Icons } from '@/styles/globalStyles';
import { AttendanceIdContainer } from '@/styles/app/attendancesId.styles';

// Components
import Icon from '@/components/Icon';
import AttendanceItem from '@/app/attendances/components/AttendanceItem';

// Types
export interface AttendanceItemType {
    id: number;
    name: string;
    status: string;
    isDetailOpen: boolean;
}

const Index = () => {
    const attendanceId = usePathname().split('/')[2];

    const status: { icon: string; count: number }[] = [
        { icon: 'groups', count: 12 },
        { icon: 'sentiment_satisfied_alt', count: 10 },
        { icon: 'watch_later', count: 1 },
        { icon: 'highlight_off', count: 1 },
    ];

    const [dummyList, setDummyList] = useState<AttendanceItemType[]>([
        { id: 1, name: '김차력', status: '출석', isDetailOpen: false },
        { id: 2, name: '김차린', status: '지각', isDetailOpen: false },
        { id: 3, name: '김하력', status: '결석', isDetailOpen: false },
        { id: 4, name: '계창선', status: '출석', isDetailOpen: false },
    ]);

    const { data: attendance, isLoading } = useQuery({
        queryKey: ['attendance'],
        queryFn: async () => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceById(
                    attendanceId
                );
            return response.data;
        },
    });

    function handleClickDetail(index: number, value: boolean) {
        setDummyList((prevState) => {
            return prevState.map((item, idx) => {
                if (idx === index)
                    return Object.assign(item, { isDetailOpen: !value });
                else return item;
            });
        });
    }

    function handleClickStatus(index: number, value: string) {
        setDummyList((prevState) => {
            return prevState.map((item, idx) => {
                if (idx === index)
                    return Object.assign(item, { status: value });
                else return item;
            });
        });
    }

    // console.log('attendance', attendance);

    if (isLoading) return <div>loading..</div>; // TODO: 스피너 이미지 생기면 교체하기

    return (
        <AttendanceIdContainer>
            <section className="attendance-header">
                <div className="attendance-img"></div>

                <section className="attendance-info">
                    <div className="name">출석부 이름</div>
                    <div className="date-container">
                        <div className="date">03</div>
                        <div className="date">20</div>
                        <div className="date">수</div>
                    </div>
                </section>

                <section className="attendance-status-container">
                    {status.map((item) => (
                        <div className="status">
                            <Icon
                                icon={Icons[item.icon]}
                                color={Colors.Gray80}
                                size={16}
                            />
                            <div className="count">{item.count}</div>
                        </div>
                    ))}
                </section>
            </section>

            {/* 출석부 명단 */}
            <section className="attendance-list">
                {dummyList.map((item, index) => (
                    <AttendanceItem
                        item={item}
                        index={index}
                        handleClickDetail={handleClickDetail}
                        handleClickStatus={handleClickStatus}
                    />
                ))}
            </section>
        </AttendanceIdContainer>
    );
};

export default Index;
