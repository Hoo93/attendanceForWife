'use client';

import { usePathname } from 'next/navigation';

// Api
import { useQuery } from '@tanstack/react-query';
import AttendanceApiClient from '@/api/AttendanceApiClient';

// Styles
import AttendanceIdContainer from '@/styles/app/attendancesId.styles';
import Icon from '@/components/Icon';
import { Icons } from '@/styles/globalStyles';

const Index = () => {
    const attendanceId = usePathname().split('/')[2];

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

    // console.log('attendance', attendance);

    if (isLoading) return <div>loading..</div>;

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

                <section className="attendance-status">
                    <Icon icon={Icons.groups} />
                </section>
            </section>

            <section className="attendance-list"></section>
        </AttendanceIdContainer>
    );
};

export default Index;
