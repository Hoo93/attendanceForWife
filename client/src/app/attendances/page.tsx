'use client';

import 'dayjs/locale/ko'; // 한국어 locale 설정
import dayjs from 'dayjs';
import AttendanceApiClient from '@/api/AttendanceApiClient';
import { Box, Container, Typography, styled, useTheme } from '@mui/material';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React from 'react';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

dayjs.locale('ko');

const Index = () => {
    const isSmall = useMediaQuery({
        query: '(min-width: 393px)',
    });

    const [isCreate, setIsCreate] = useState<boolean>(false);
    const theme = useTheme();
    // 오늘 날짜
    const today = dayjs();
    const todayFormat = today.format('YYYY년 MM월 DD일 dddd');

    const { data: attendancyList } = useQuery({
        queryKey: ['attendancy-list'],
        queryFn: async () => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceList();
            return response.data;
        },
    });

    //   const {} = useInfiniteQuery({
    //     queryKey: ["attendancy-list"],
    //     queryFn: async ({ pageParam }) =>
    //       await AttendancyApiClient.getInstance().getAttendanceList(),
    //   });

    return (
        <ContainerST>
            <StyledBoxST>
                <Typography>{todayFormat}</Typography>
                <Typography>김범수님, 안녕하세요.</Typography>
                <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Box></Box>
                        <Box></Box>
                    </Box>
                </Box>
            </StyledBoxST>
            {/* {attendancyPage?.data?.items.map((page, index) => {

          return;
        })} */}

            {/* <CommonTable
          infoList={attendancyList}
          setIsCreate={setIsCreate}
          isCreate={isCreate}
          isLoading={isLoading}
        /> */}
        </ContainerST>
    );
};

export default Index;

const ContainerST = styled(Container)`
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
`;
const StyledBoxST = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
`;
