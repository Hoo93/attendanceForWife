'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

// Styles
import { Colors, Icons } from '@/styles/globalStyles';
import { ListManagementContainer } from '@/styles/app/listManagement.styles';

// Api
import { useQuery } from '@tanstack/react-query';
import AttendanceApiClient from '@/api/AttendanceApiClient';

// Components
import { Fab } from '@mui/material';
import Icon from '@/components/Icon';
import AttendanceItem from '@/app/list-management/components/AttendanceItem';

// Types
export interface AttendanceItemType {
    id: number;
    name: string;
    status: string;
    isDetailOpen: boolean;
    lateTime?: string;
    absentType?: string;
    lateReason?: string;
}

const ListManagement = () => {
    const attendanceId = usePathname().split('/')[2];

    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

    // TODO: api 데이터 제대로 내려오면 하단의 attendance로 대체될 예정.
    const [dummyList, setDummyList] = useState<AttendanceItemType[]>([
        { id: 1, name: '김차력', status: '', isDetailOpen: false },
        { id: 2, name: '김차린', status: '', isDetailOpen: false },
        { id: 3, name: '김하력', status: '', isDetailOpen: false },
        { id: 4, name: '계창선', status: '', isDetailOpen: false },
        { id: 5, name: '계창선', status: '', isDetailOpen: false },
        { id: 6, name: '계창선', status: '', isDetailOpen: false },
        { id: 7, name: '계창선', status: '', isDetailOpen: false },
        { id: 8, name: '계창선', status: '', isDetailOpen: false },
    ]);

    // fetching API
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

    /**
     * @description 출석/지각/결석 선택 및 상세사유 입력 등 출석대상 목록의 값을 변경하는 함수
     */
    const handleListItem = (
        index: number,
        field: string,
        value: string | boolean
    ) => {
        setDummyList((prevState) => {
            return prevState.map((item, idx) => {
                if (idx === index)
                    return Object.assign(item, { [field]: value });
                else return item;
            });
        });
    };

    return (
        <ListManagementContainer>
            <section className="attendance-header">
                <div className="attendance-img"></div>

                <section className="attendance-info">
                    {/* TODO: 추후 데이터 제대로 내려오면 api 값으로 변경 필요 */}
                    <div className="name">출석부 이름</div>
                </section>
            </section>

            {/* 출석부 명단 */}
            <section className="attendance-list">
                {dummyList.map((item, index) => (
                    <AttendanceItem
                        item={item}
                        index={index}
                        handleListItem={handleListItem}
                    />
                ))}
            </section>

            {/* 등록 버튼 */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setIsAddOpen(true)}
            >
                <Icon icon={Icons.add} size={32} color={Colors.White} />
            </Fab>
        </ListManagementContainer>
    );
};

export default ListManagement;
