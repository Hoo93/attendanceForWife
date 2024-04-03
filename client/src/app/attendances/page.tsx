'use client';

import 'dayjs/locale/ko'; // 한국어 locale 설정
import dayjs from 'dayjs';

import {
    Avatar,
    Box,
    Button,
    Container,
    FormControlLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
    styled,
} from '@mui/material';
import React, { useRef, useState } from 'react';

import AttendanceApiClient from '@/api/AttendanceApiClient';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

dayjs.locale('ko');

const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

const Index = () => {
    const router = useRouter();

    // 오늘 날짜
    const today = dayjs();
    const todayFormat = today.format('YYYY년 MM월 DD일 dddd');
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [fileImage, setFileImage] = useState<any>();
    const [tempSelected, setTempSelected] = useState<string | undefined>();
    const [formData, setFormData] = useState<FormData | null>(null);
    // 시작 시간과 종료 시간의 옵션을 생성합니다.
    const hours = [];
    for (let i = 0; i <= 23; i++) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        hours.push(hour);
    }
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

    // TODO 파일 업로드
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (event: any) => {
        const selectedFile = event.target.files[0];
        setFileImage(event.target.files[0]);
        const reader = new FileReader();

        reader.onload = (e) => {
            if (e.target && e.target.result) {
                setImageSrc(e.target.result as string);
                setTempSelected(e.target.result as string);
            }
        };

        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // 요일 선택 로직
    const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());

    const handleSelectDay = (day: string) => {
        const updatedSelectedDays = new Set(selectedDays);
        if (updatedSelectedDays.has(day)) {
            updatedSelectedDays.delete(day);
        } else {
            updatedSelectedDays.add(day);
        }
        setSelectedDays(updatedSelectedDays);
    };

    return (
        <ContainerST>
            {!isCreate ? (
                <StyledBoxST>
                    <Box>
                        <Typography
                            sx={{
                                fontFamily: 'Noto Sans',
                                fontSize: '14px',
                                lineHeight: '19.07px',
                                color: '#797979',
                            }}
                        >
                            {todayFormat}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'Noto Sans',
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
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily: 'Noto Sans',
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
                                                fontFamily: 'Noto Sans',
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
                                        <Box
                                            display={'flex'}
                                            alignItems={'center'}
                                            justifyContent={'space-between'}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily: 'Noto Sans',
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
                                                    fontFamily: 'Noto Sans',
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
            ) : (
                <Box gap={'24px'} display={'flex'} flexDirection={'column'}>
                    <Image
                        src={'/images/icons/arrow-back-icon.svg'}
                        alt=""
                        width={24}
                        height={24}
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={() => setIsCreate(false)}
                    />
                    <Typography
                        sx={{
                            fontFamily: 'Noto Sans',
                            fontSize: '20px',
                            fontWeight: 600,
                            lineHeight: '27.24px',
                        }}
                    >
                        정보 입력
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: 'Noto Sans',
                            fontSize: '14px',
                            lineHeight: '19.07px',
                            color: '#797979',
                        }}
                    >
                        출석부 이미지
                    </Typography>
                    {imageSrc ? (
                        <Avatar
                            src={imageSrc}
                            alt="profile"
                            sx={{
                                width: '92px',
                                height: '92px',
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: '92px',
                                height: '92px',
                                border: '1px solid #D5D5D5',
                                borderRadius: '8px',
                            }}
                            onClick={handleImageClick}
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange(e)}
                    />
                    {/* 출석부 이름 */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Noto Sans',
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '19.07px',
                            }}
                        >
                            출석부 이름
                        </Typography>
                        <TextField
                            sx={{
                                '&::placeholder': {
                                    fontSize: '24px', // 원하는 글꼴 크기로 변경
                                },
                            }}
                            placeholder="출석부 이름을 입력해주세요."
                            inputProps={TextFieldProps}
                        />
                    </Box>
                    {/*  출석부 지각 사용 여부*/}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Noto Sans',
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '19.07px',
                            }}
                        >
                            출석부 지각 사용 여부
                        </Typography>
                        <RadioGroup aria-label="gender" name="gender1" row>
                            <FormControlLabel
                                value="Y"
                                control={<Radio />}
                                label="사용함"
                            />
                            <FormControlLabel
                                value="N"
                                control={<Radio />}
                                label="사용하지 않음"
                            />
                        </RadioGroup>
                    </Box>
                    {/*  요일 선택 */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Noto Sans',
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '19.07px',
                            }}
                        >
                            요일 선택
                        </Typography>
                        <Grid
                            container
                            spacing={0}
                            justifyContent="space-between"
                        >
                            {daysOfWeek.map((day, index) => (
                                <Grid key={index} item>
                                    <Typography
                                        align="center"
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            lineHeight: '40px',
                                            border: `1px solid ${selectedDays.has(day) ? '#59996B' : '#D5D5D5'}`,
                                            color: selectedDays.has(day)
                                                ? '#59996B'
                                                : '#C9C9C9',

                                            borderRadius: '8px',
                                        }}
                                        onClick={() => handleSelectDay(day)}
                                    >
                                        {day}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/*  시간 선택 */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Noto Sans',
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '19.07px',
                            }}
                        >
                            시간 선택
                        </Typography>
                        <Grid
                            container
                            spacing={2}
                            justifyContent="space-between"
                        >
                            <Grid item>
                                <Select
                                    labelId="start-time-label"
                                    id="start-time-select"
                                    displayEmpty
                                    renderValue={(v: any) =>
                                        v?.length ? (
                                            v
                                        ) : (
                                            <span style={{ color: '#D5D5D5' }}>
                                                시작 시간 선택
                                            </span>
                                        )
                                    }
                                    sx={{
                                        width: 163,
                                        height: 40,
                                        border: '1px solid #D5D5D5',
                                        borderRadius: '8px',
                                    }}
                                >
                                    {hours.map((hour) => (
                                        <MenuItem key={hour} value={hour}>
                                            {hour}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item>
                                <Select
                                    labelId="end-time-label"
                                    id="end-time-select"
                                    displayEmpty
                                    renderValue={(v: any) =>
                                        v?.length ? (
                                            v
                                        ) : (
                                            <span style={{ color: '#D5D5D5' }}>
                                                종료 시간 선택
                                            </span>
                                        )
                                    }
                                    sx={{
                                        width: 163,
                                        height: 40,
                                        border: '1px solid #D5D5D5',
                                        borderRadius: '8px',
                                    }}
                                >
                                    {hours.map((hour) => (
                                        <MenuItem key={hour} value={hour}>
                                            {hour}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 선생님 선택 */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Noto Sans',
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '19.07px',
                            }}
                        >
                            선생님 선택
                        </Typography>
                        <Select
                            labelId="end-time-label"
                            id="end-time-select"
                            displayEmpty
                            renderValue={(v: any) =>
                                v?.length ? (
                                    v
                                ) : (
                                    <span style={{ color: '#D5D5D5' }}>
                                        선생님을 선택해주세요.
                                    </span>
                                )
                            }
                            sx={{
                                width: '100%',
                                height: 40,
                                border: '1px solid #D5D5D5',
                                borderRadius: '8px',
                            }}
                        />
                    </Box>
                    <Button
                        sx={{
                            width: '100%',
                            height: '48px',
                            border: '1px solid #59996B',
                            background: ' #59996B',
                            color: 'white',
                            borderRadius: '8px',
                        }}
                    >
                        저장하기
                    </Button>
                </Box>
            )}
        </ContainerST>
    );
};

export default Index;

// // TODO: 하린님 페이지 완성되면 이어서 작업할 예정
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
const TextFieldProps = {
    disableUnderline: true,
    style: {
        backgroundColor: 'white',
        padding: '0px',
        width: '339px',
        height: '40px',
        borderRadius: '8px',
        border: '1px solid #D5D5D5',
        paddingLeft: '12px',
        fontSize: '16px',
    },
};
