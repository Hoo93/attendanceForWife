'use client';

import 'dayjs/locale/ko'; // 한국어 locale 설정
import dayjs from 'dayjs';

import { Box, Container, Typography, styled } from '@mui/material';
import React, { useState } from 'react';

import AttendanceApiClient from '@/api/AttendanceApiClient';
import AttendanceCreateForm from './components';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

dayjs.locale('ko');

interface AttendanceData {
    title: string;
    description: string;
    type: string;
}
const Index = () => {
    const router = useRouter();

    const today = dayjs(); // 오늘 날짜
    const todayFormat = today.format('YYYY년 MM월 DD일 dddd');
    const [isCreate, setIsCreate] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormData | null>(null);

    const [attendanceCreate, setAttendanceCreate] = useState<AttendanceData>();

    const { data: attendancyList } = useQuery({
        queryKey: ['attendancy-list'],
        queryFn: async () => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceList();
            return response.data;
        },
    });

    const uploadImage = async (image: File) => {
        const file = image;
        if (file) {
            const newFormData = new FormData();
            newFormData.append('image', file);
            setFormData(newFormData);
        }
    };

    return (
        <ContainerST>
            {isCreate ? (
                <AttendanceCreateForm
                    setIsCreate={setIsCreate}
                    setAttendanceCreate={setAttendanceCreate}
                />
            ) : (
                <StyledBoxST>
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '14px',
                                lineHeight: '19.07px',
                                color: '#797979',
                            }}
                        >
                            {todayFormat}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '20px',
                                fontWeight: 600,
                                lineHeight: '27.24px',
                            }}
                        >
                            김범수님, 안녕하세요.
                        </Typography>
                    </Box>
                    <Box
                        display={'flex'}
                        sx={{
                            width: '320px',
                            height: '200',
                            margin: 'auto',
                            gap: '10px',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            padding: '0px 4px',
                        }}
                    >
                        {attendancyList?.items.map((item: any) => {
                            return (
                                <Box
                                    sx={{
                                        width: '150px',
                                        height: '185px',
                                        border: '1px solid green',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '4px',
                                    }}
                                >
                                    <Image
                                        src={'/images/sckeleton-image.svg'}
                                        width={142}
                                        height={102}
                                        alt="스켈레톤 이미지"
                                        onClick={() =>
                                            router.push(
                                                `/attendances/${item.attendanceId}`
                                            )
                                        }
                                    />
                                    <Box
                                        width={'100%'}
                                        sx={{
                                            padding: '0px 7px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '3px',
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: '16px',
                                                    fontWeight: 600,
                                                    lineHeight: '21.79px',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {item.attendance.title}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    color: '#797979',
                                                    lineHeight: '19.07px',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {item.attendance.description}
                                            </Typography>
                                        </Box>
                                        <Box
                                            display={'flex'}
                                            alignItems={'center'}
                                            justifyContent={'space-between'}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    color: '#797979',
                                                    lineHeight: '16.34px',
                                                }}
                                            >
                                                월,화,목,금,일
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    alignItems: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                    border: '1px solid #F0FFF4',
                                                    lineHeight: '16.34px',
                                                }}
                                            >
                                                {item.attendance.attendeeCount}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                    <Image
                        src={'/images/icons/add-icon.svg'}
                        alt=""
                        width={48}
                        height={48}
                        style={{
                            cursor: 'pointer',
                            marginLeft: 'auto',
                        }}
                        onClick={() => setIsCreate(true)}
                    />
                </StyledBoxST>
            )}
        </ContainerST>
    );
};

export default Index;

// TODO: 하린님 페이지 완성되면 이어서 작업할 예정
// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const queryClient = new QueryClient();
//     const id = context.params!.id as string;
//     await queryClient.prefetchQuery({
//         queryKey: ['아직 안정했음~', id],
//         queryFn: () => {},
//     });
//     return {
//         props: {
//             dehydratedState: dehydrate(queryClient),
//         },
//     };
// };

const ContainerST = styled(Container)`
    flex-direction: column;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    gap: 10px;
    max-width: 340px;
    margin: auto;
`;
const StyledBoxST = styled(Box)`
    display: flex;
    flex-wrap: wrap; /* 요소들을 여러 줄에 걸쳐 정렬 */
    gap: 28px;
    flex-direction: column;
    justify-content: space-between; /* 요소들을 간격을 두고 정렬 */
`;
