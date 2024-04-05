'use client';

import {
    Avatar,
    Box,
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
import { SetStateAction, useRef, useState } from 'react';

import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';

interface AttendanceData {
    title: string;
    description: string;
    type: string;
}
interface IProps {
    setIsCreate: React.Dispatch<SetStateAction<boolean>>;
}
const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

const AttendanceCreateForm = (props: IProps) => {
    const { setIsCreate } = props;
    const hours = [];
    for (let i = 0; i <= 23; i++) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        hours.push(hour);
    }

    //State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [fileImage, setFileImage] = useState<any>();
    const [tempSelected, setTempSelected] = useState<string | undefined>();
    const [attendanceCreate, setAttendanceCreate] = useState<AttendanceData>();

    const { mutate } = useMutation({
        mutationKey: [''],
    });

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
        <ContainerSTForm>
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
            <Typography fontSize={20} fontWeight={600} lineHeight={'27.24px'}>
                정보 입력
            </Typography>
            <Typography fontSize={14} lineHeight={'19.07px'} color={'#797979'}>
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
                <BoxSTImage onClick={handleImageClick} />
            )}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e)}
            />

            {/* 출석부 이름 */}
            <BoxSTTitle>
                <TypoST>출석부 이름</TypoST>
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
            </BoxSTTitle>
            {/*  출석부 지각 사용 여부*/}
            <BoxSTTitle>
                <TypoST>출석부 지각 사용 여부</TypoST>
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
            </BoxSTTitle>
            {/*  요일 선택 */}
            <BoxSTTitle>
                <TypoST>요일 선택</TypoST>
                <Grid container spacing={0} justifyContent="space-between">
                    {daysOfWeek.map((day, index) => (
                        <Grid key={index} item>
                            <TypoSTDay
                                align="center"
                                sx={{
                                    border: `1px solid ${selectedDays.has(day) ? '#59996B' : '#D5D5D5'}`,
                                    color: selectedDays.has(day)
                                        ? '#59996B'
                                        : '#C9C9C9',
                                }}
                                onClick={() => handleSelectDay(day)}
                            >
                                {day}
                            </TypoSTDay>
                        </Grid>
                    ))}
                </Grid>
            </BoxSTTitle>

            {/*  시간 선택 */}
            <BoxSTTitle>
                <TypoST>시간 선택</TypoST>
                <Grid container spacing={2} justifyContent="space-between">
                    <Grid item>
                        <SelectSTTime
                            labelId="start-time-label"
                            id="start-time-select"
                            displayEmpty
                            renderValue={(v: any) =>
                                v?.length ? (
                                    v
                                ) : (
                                    <span color="#D5D5D5">시작 시간 선택</span>
                                )
                            }
                        >
                            {hours.map((hour) => (
                                <MenuItem key={hour} value={hour}>
                                    {hour}
                                </MenuItem>
                            ))}
                        </SelectSTTime>
                    </Grid>
                    <Grid item>
                        <SelectSTTime
                            labelId="end-time-label"
                            id="end-time-select"
                            displayEmpty
                            renderValue={(v: any) =>
                                v?.length ? (
                                    v
                                ) : (
                                    <span color="#D5D5D5">종료 시간 선택</span>
                                )
                            }
                        >
                            {hours.map((hour) => (
                                <MenuItem key={hour} value={hour}>
                                    {hour}
                                </MenuItem>
                            ))}
                        </SelectSTTime>
                    </Grid>
                </Grid>
            </BoxSTTitle>

            <BoxSTSave>저장하기</BoxSTSave>
        </ContainerSTForm>
    );
};

export default AttendanceCreateForm;

const TextFieldProps = {
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

const ContainerSTForm = styled(Container)(() => {
    return {
        display: 'flex',
        gap: '24px',
        flexDirection: 'column',
        flexWrap: 'wrap',
    };
});

const BoxSTImage = styled(Box)(() => {
    return {
        width: '92px',
        height: '92px',
        border: '1px solid #D5D5D5',
        borderRadius: '8px',
        cursor: 'pointer',
    };
});
const BoxSTTitle = styled(Box)(() => {
    return {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    };
});

const TypoST = styled(Typography)(() => {
    return {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '19.07px',
    };
});

const BoxSTSave = styled(Box)(() => {
    return {
        width: '100%',
        height: '48px',
        border: '1px solid #59996B',
        background: ' #59996B',
        color: 'white',
        borderRadius: '8px',
        alignContent: 'center',
        textAlignLast: 'center',
    };
});

const SelectSTTime = styled(Select)(() => {
    return {
        width: 163,
        height: 40,
        border: '1px solid #D5D5D5',
        borderRadius: '8px',
    };
});

const TypoSTDay = styled(Typography)(() => {
    return {
        width: 40,
        height: 40,
        lineHeight: '40px',
        borderRadius: '8px',
        cursor: 'pointer',
    };
});
