'use client';

import {
    Avatar,
    Box,
    Button,
    FormControlLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { SetStateAction, useRef, useState } from 'react';

import Image from 'next/image';

interface AttendanceData {
    title: string;
    description: string;
    type: string;
}
interface IProps {
    setIsCreate: React.Dispatch<SetStateAction<boolean>>;
    setAttendanceCreate: React.Dispatch<
        SetStateAction<AttendanceData | undefined>
    >;
}

const AttendanceCreateForm = (props: IProps) => {
    const { setIsCreate, setAttendanceCreate } = props;
    const hours = [];
    for (let i = 0; i <= 23; i++) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        hours.push(hour);
    }
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
    const [fileImage, setFileImage] = useState<any>();
    const [tempSelected, setTempSelected] = useState<string | undefined>();
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

    const onChange = (field: keyof AttendanceData, value: string) => {
        setAttendanceCreate((prevState) => ({
            ...prevState!,
            [field]: value!,
        }));
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
                    fontSize: '20px',
                    fontWeight: 600,
                    lineHeight: '27.24px',
                }}
            >
                정보 입력
            </Typography>
            <Typography
                sx={{
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
                    onChange={(e) => onChange('title', e.target.value)}
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
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '19.07px',
                    }}
                >
                    요일 선택
                </Typography>
                <Grid container spacing={0} justifyContent="space-between">
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
                                    cursor: 'pointer',
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
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '19.07px',
                    }}
                >
                    시간 선택
                </Typography>
                <Grid container spacing={2} justifyContent="space-between">
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
    );
};

export default AttendanceCreateForm;

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
