'use client';

//Api
import AuthApiClient, { RegisterData } from '@/api/AuthApiClient';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    styled,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const index = () => {
    const isSmall = useMediaQuery({
        query: '(min-width: 393px)',
    });

    const router = useRouter();

    const [mounted, setMounted] = useState<boolean>(false);
    const [phoneNumberDisabled, setPhoneNumberDisabled] =
        useState<boolean>(false);
    const [emailDisabled, setEmailDisabled] = useState<boolean>(false);
    const [userNameDisabled, setUsernameDisabled] = useState<boolean>(false);
    const [register, setRegister] = useState<RegisterData>();

    const onChange = (field: keyof RegisterData, value: string) => {
        setRegister((prevState) => ({
            ...prevState!,
            [field]: value,
        }));
    };
    const { mutate: siginUpMutation } = useMutation({
        mutationKey: [''],
        mutationFn: () => AuthApiClient.getInstance().userRegister(register!),
        onSuccess: () => {
            alert('가입이 완료되었습니다.');
            router.push('/auth/signin');
        },
    });

    const { mutate: checkEmailMutation } = useMutation({
        mutationKey: [''],
        mutationFn: () =>
            AuthApiClient.getInstance().userCheckEmail(register?.email!),
        onSuccess: () => {
            alert('인증되었습니다!');
            setEmailDisabled(true);
        },
    });

    const { mutate: checkPhoneNumberMutation } = useMutation({
        mutationKey: [''],
        mutationFn: () =>
            AuthApiClient.getInstance().userCheckPhoneNumber(
                register?.mobileNumber!
            ),
        onSuccess: () => {
            alert('인증되었습니다!');
            setPhoneNumberDisabled(true);
        },
    });

    const { mutate: checkUserNameMutation } = useMutation({
        mutationKey: [''],
        mutationFn: () =>
            AuthApiClient.getInstance().userCheckUsername(register?.username!),
        onSuccess: () => {
            alert('인증되었습니다!');
            setUsernameDisabled(true);
        },
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {mounted && isSmall === true ? (
                <ContainerST>
                    <StyledBoxST>
                        <LoginTypographyST>회원가입</LoginTypographyST>
                        <Box
                            component="form"
                            display={'flex'}
                            flexDirection={'column'}
                            gap={'10px'}
                        >
                            <TextField
                                value={register?.name}
                                placeholder="이름을 입력해주세요."
                                onChange={(e) =>
                                    onChange('name', e.target.value)
                                }
                                sx={{
                                    '&::placeholder': {
                                        fontSize: '24px', // 원하는 글꼴 크기로 변경
                                    },
                                }}
                                inputProps={TextFieldProps}
                            />
                            <Box
                                display={'flex'}
                                justifyContent={'space-between'}
                            >
                                <TextField
                                    value={register?.mobileNumber}
                                    placeholder="핸드폰 번호를 입력해주세요."
                                    disabled={phoneNumberDisabled}
                                    onChange={(e) =>
                                        onChange('mobileNumber', e.target.value)
                                    }
                                    sx={{
                                        '&::placeholder': {
                                            fontSize: '24px', // 원하는 글꼴 크기로 변경
                                        },
                                    }}
                                    inputProps={TextFieldProps2}
                                />
                                <AuthDisabledButton
                                    onClick={() => checkPhoneNumberMutation()}
                                    disabled={
                                        register?.mobileNumber === undefined ||
                                        register?.mobileNumber === ''
                                    }
                                    sx={{
                                        backgroundColor:
                                            register?.mobileNumber ===
                                                undefined ||
                                            register?.mobileNumber === ''
                                                ? null
                                                : 'black',
                                    }}
                                >
                                    {phoneNumberDisabled
                                        ? '확인완료'
                                        : '인증요청'}
                                </AuthDisabledButton>
                            </Box>
                            <TextField
                                value={register?.birthday}
                                placeholder="생년월일을 선택해주세요."
                                onChange={(e) =>
                                    onChange('birthday', e.target.value)
                                }
                                sx={{
                                    '&::placeholder': {
                                        fontSize: '24px', // 원하는 글꼴 크기로 변경
                                    },
                                }}
                                inputProps={TextFieldProps}
                            />

                            <Box
                                display={'flex'}
                                justifyContent={'space-between'}
                            >
                                <TextField
                                    value={register?.email}
                                    placeholder="이메일 주소를 입력해주세요."
                                    disabled={emailDisabled}
                                    onChange={(e) =>
                                        onChange('email', e.target.value)
                                    }
                                    sx={{
                                        '&::placeholder': {
                                            fontSize: '24px', // 원하는 글꼴 크기로 변경
                                        },
                                    }}
                                    inputProps={TextFieldProps2}
                                />
                                <AuthDisabledButton
                                    onClick={() => checkEmailMutation()}
                                    disabled={
                                        register?.email === undefined ||
                                        register?.email === ''
                                    }
                                    sx={{
                                        backgroundColor:
                                            register?.email === undefined ||
                                            register?.email === ''
                                                ? null
                                                : 'black',
                                    }}
                                >
                                    {emailDisabled ? '확인완료' : '중복확인'}
                                </AuthDisabledButton>
                            </Box>

                            <Box
                                display={'flex'}
                                justifyContent={'space-between'}
                            >
                                <TextField
                                    value={register?.username}
                                    placeholder="아이디를 입력해주세요."
                                    disabled={userNameDisabled}
                                    onChange={(e) =>
                                        onChange('username', e.target.value)
                                    }
                                    sx={{
                                        '&::placeholder': {
                                            fontSize: '24px', // 원하는 글꼴 크기로 변경
                                        },
                                    }}
                                    inputProps={TextFieldProps2}
                                />
                                <AuthDisabledButton
                                    onClick={() => checkUserNameMutation()}
                                    disabled={
                                        register?.username === undefined ||
                                        register?.username === ''
                                    }
                                    sx={{
                                        backgroundColor:
                                            register?.username === undefined ||
                                            register?.username === ''
                                                ? null
                                                : 'black',
                                    }}
                                >
                                    {userNameDisabled ? '확인완료' : '중복확인'}
                                </AuthDisabledButton>
                            </Box>

                            <TextField
                                value={register?.password}
                                placeholder="비밀번호를 입력해주세요."
                                onChange={(e) =>
                                    onChange('password', e.target.value)
                                }
                                sx={{
                                    '&::placeholder': {
                                        fontSize: '24px', // 원하는 글꼴 크기로 변경
                                    },
                                }}
                                inputProps={TextFieldProps}
                            />

                            <TextField
                                value={register?.password}
                                placeholder="비밀번호를 확인해주세요."
                                onChange={(e) =>
                                    onChange('password', e.target.value)
                                }
                                sx={{
                                    '&::placeholder': {
                                        fontSize: '24px', // 원하는 글꼴 크기로 변경
                                    },
                                }}
                                inputProps={TextFieldProps}
                            />

                            <RegisterDisabledButton
                                sx={{
                                    backgroundColor:
                                        phoneNumberDisabled &&
                                        emailDisabled &&
                                        userNameDisabled
                                            ? '#59996B'
                                            : null,
                                }}
                                disabled={
                                    phoneNumberDisabled &&
                                    emailDisabled &&
                                    userNameDisabled
                                        ? false
                                        : true
                                }
                                onClick={() => {
                                    siginUpMutation();
                                }}
                            >
                                가입하기
                            </RegisterDisabledButton>
                        </Box>
                        <Image
                            src={'/images/login/checkuree_logo.svg'}
                            width={100}
                            height={100}
                            alt=""
                        />
                    </StyledBoxST>
                </ContainerST>
            ) : (
                <Image
                    src={'/images/login/checkuree_logo.svg'}
                    width={200}
                    height={200}
                    alt=""
                />
            )}
        </>
    );
};

export default index;

const TextFieldProps = {
    disableUnderline: true,
    style: {
        backgroundColor: 'white',
        padding: '0px',
        width: '301px',
        height: '40px',
        borderRadius: '8px',
        border: '0px',
        paddingLeft: '12px',
        fontSize: '16px',
    },
};
const TextFieldProps2 = {
    disableUnderline: true,
    style: {
        backgroundColor: 'white',
        padding: '0px',
        width: '213px',
        height: '40px',
        borderRadius: '8px',
        border: '0px',
        paddingLeft: '12px',
        fontSize: '16px',
    },
};
const DateTextFieldProps = {
    disableUnderline: true,
    style: {
        backgroundColor: 'white',
        padding: '0px',
        width: '273px',
        height: '40px',
        leftBorderRadius: '8px',
        border: '0px',
        paddingLeft: '10px',
        fontSize: '16px',
    },
};

// Container에 대한 스타일
const ContainerST = styled(Container)`
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
`;

// Box에 대한 스타일
const StyledBoxST = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
`;

// Typography에 대한 스타일
const LoginTypographyST = styled(Typography)`
    font-weight: 600;
    font-family: 'Noto sans';
    font-size: 32px;
    line-height: 43.58px;
`;

// AuthButton 대한 스타일
const AuthButton = styled(Button)`
    borderradius: 8px;
    width: 80px;
    height: 39px;
`;

const AuthDisabledButton = styled(AuthButton)`
    color: white;
    background-color: #d5d5d5;
`;

const RegisterDisabledButton = styled(Button)`
    color: white;
    background-color: #d5d5d5;
    width: 313px;
    height: 48px;
`;
