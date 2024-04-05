'use client';

//Api
import AuthApiClient, { LoginData } from '@/api/AuthApiClient';
import {
    Box,
    Button,
    Checkbox,
    Container,
    CssBaseline,
    TextField,
    Typography,
    styled,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import axios from 'axios';
import { setTokens } from '@/libs/auth';
import { useMediaQuery } from 'react-responsive';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const index = () => {
    const router = useRouter();
    const isSmall = useMediaQuery({
        query: '(min-width: 393px)',
    });

    const [mounted, setMounted] = useState<boolean>(false);
    const [login, setLogin] = useState<LoginData>();

    const fetchLogin = async (params: LoginData) => {
        try {
            const response =
                await AuthApiClient.getInstance().userLogin(params);

            const token = response.data.data!.accessToken;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setTokens({
                accessToken: response.data.data!.accessToken,
                refreshToken: response.data.data!.refreshToken,
            });

            return response;
        } catch (error) {
            //
            // 오류 처리
            console.error('Error occurred during login:', error);
            throw error;
        }
    };

    const { mutate: loginMudation } = useMutation({
        mutationFn: fetchLogin,
        onSuccess: () => {
            alert('로그인 되었습니다.');
            router.push('/attendances');
        },
        onError: () => {
            alert('아이디 및 비밀번호가 일치하지 않습니다.');
        },
    });

    // Hook
    const onChange = (field: keyof LoginData, value: string | boolean) => {
        setLogin((prevState) => ({
            ...prevState!,
            [field]: value,
        }));
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <ContainerST>
                <CssBaseline />
                <StyledBoxST>
                    <LoginTypographyST>로그인</LoginTypographyST>
                    <Box
                        component="form"
                        display={'flex'}
                        flexDirection={'column'}
                        gap={'10px'}
                    >
                        <TextField
                            value={login?.username}
                            placeholder="아이디를 입력해주세요."
                            onChange={(e) =>
                                onChange('username', e.target.value)
                            }
                            inputProps={TextFiledInputProps}
                        />
                        <TextField
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            onChange={(e) =>
                                onChange('password', e.target.value)
                            }
                            inputProps={TextFiledInputProps}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                            }}
                        >
                            <StyledCheckbox
                                inputProps={{
                                    style: {
                                        padding: 0,
                                    },
                                }}
                                sx={{
                                    color: '#D9D9D9',
                                }}
                                onChange={(e) =>
                                    onChange('isAutoLogin', e.target?.checked)
                                }
                            />
                            <Typography
                                sx={{
                                    fontSize: '12.5px',
                                    color: '#D9D9D9',
                                    lineHeight: '16.34px',
                                    fontWeight: 500,
                                    verticalAlign: 'middle',
                                }}
                            >
                                로그인 유지
                            </Typography>
                        </Box>
                        <Button
                            sx={{
                                width: '318px',
                                height: '48px',
                                color: 'white',
                                backgroundColor: '#59996B',
                            }}
                            onClick={() => {
                                loginMudation(login!);
                            }}
                        >
                            로그인 하기
                        </Button>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <StyledLinkTypography
                                onClick={() => router.push('/auth/signup')}
                            >
                                회원가입
                            </StyledLinkTypography>
                            <StyledLinkTypography
                                onClick={() => alert('준비중인 기능입니다.')}
                            >
                                아이디/비밀번호 찾기
                            </StyledLinkTypography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <StyledKakaoLoginButton
                                onClick={() => {
                                    alert('준비중인 기능입니다.');
                                }}
                            >
                                카카오 로그인
                            </StyledKakaoLoginButton>
                            <StyledNaverLoginButton
                                sx={{
                                    width: '152px',
                                    height: '40px',
                                    color: 'white',
                                    backgroundColor: '#00BF19',
                                    borderRadius: '20px',
                                }}
                                onClick={() => {
                                    alert('준비중인 기능입니다.');
                                }}
                            >
                                네이버 로그인
                            </StyledNaverLoginButton>
                        </Box>
                    </Box>
                    <Image
                        src={'/images/logos/checkuree_logo.svg'}
                        width={100}
                        height={100}
                        alt=""
                    />
                </StyledBoxST>
            </ContainerST>
        </>
    );
};

export default index;

const TextFiledInputProps = {
    style: {
        backgroundColor: 'white',
        padding: '0px',
        width: '306px',
        height: '40px',
        borderRadius: '8px',
        border: '0px',
        paddingLeft: '12px',
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
    font-size: 32px;
    line-height: 43.58px;
`;

// Checkbox에 대한 스타일
const StyledCheckbox = styled(Checkbox)`
    padding: 0;
    border: 0;
    width: 14px;
    height: 14px;
`;

// 회원가입 및 아이디/비밀번호 찾기 텍스트 스타일
const StyledLinkTypography = styled(Typography)`
    cursor: pointer;
    font-size: 14px;
    color: #222222;
    line-height: 19.07px;
    font-weight: 500;
`;

// 카카오 및 네이버 로그인 버튼 스타일
const StyledLoginButton = styled(Button)`
    width: 152px;
    height: 40px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    text-transform: none;
`;

// 카카오 로그인 버튼의 색상
const StyledKakaoLoginButton = styled(StyledLoginButton)`
    color: black;
    background-color: #fddc3f;
`;

// 네이버 로그인 버튼의 색상
const StyledNaverLoginButton = styled(StyledLoginButton)`
    color: white;
    background-color: #00bf19;
`;
