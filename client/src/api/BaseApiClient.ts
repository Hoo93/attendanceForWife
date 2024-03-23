import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { setTokens } from '@/libs/auth';

import Cookies from 'js-cookie';

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};

class BaseApiClient {
    protected axios: AxiosInstance;

    private tokens?: Tokens;

    public constructor(baseURL: string, tokens?: Tokens) {
        this.tokens = tokens;

        this.axios = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.axios.interceptors.request.use((config) => {
            const accessToken = this.getAccessToken();
            if (accessToken != null) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        });

        this.axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const {
                    status,
                    statusText,
                    data,
                    request: { responseURL },
                } = error.response;

                console.error(
                    `API Error => responseURL : ${responseURL} status:${status} statusText:${statusText} data:${JSON.stringify(
                        data
                    )}`
                );

                const accessToken = this.getAccessToken(); // TODO 토큰 처리 해야함

                if (status === 401) {
                    // 토큰 만료 혹은 인증 실패 시
                    return this.refresh(error.config);
                }

                return Promise.reject(error);
            }
        );
    }

    // 기본 access 토큰이 설정되어 있지 않다면 브라우저 쿠키에서 가져온다.
    public getAccessToken() {
        if (this.tokens?.accessToken) {
            return this.tokens.accessToken;
        }
        if (typeof window !== 'undefined') {
            return Cookies.get(
                process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY ?? 'ACCESS_TOKEN'
            );
        }
    }

    // 기본 refresh 토큰이 설정되어 있지 않다면 브라우저 쿠키에서 가져온다.
    public getRefreshToken() {
        if (this.tokens?.refreshToken) {
            return this.tokens.refreshToken;
        }
        if (typeof window !== 'undefined') {
            return Cookies.get(
                process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY ?? 'REFRESH_TOKEN'
            );
        }
    }

    /**
     * 리프레시 및 요청을 다시 시도한다.
     */
    private async refresh(config: AxiosRequestConfig) {
        const refreshToken = this.getRefreshToken();

        if (refreshToken != null) {
            try {
                const refreshResult = await axios.request({
                    baseURL: process.env.NEXT_PUBLIC_API_ROOT,
                    url: '/auth/refresh-token',
                    method: 'POST',
                    data: {
                        refreshToken,
                    },
                });

                // 토큰 재발급 성공시
                setTokens({
                    accessToken: refreshResult.data.data!.accessToken,
                    refreshToken: refreshResult.data.data!.refreshToken,
                });

                // 무한 오류에 빠질 수 있음으로 순수한 axios 기본 인스턴스로 재시도한다.
                return axios.request({
                    ...config,
                    headers: {
                        ...config.headers,
                        Authorization: `Bearer ${refreshResult.data.data!.accessToken}`,
                    },
                });
            } catch (error) {
                console.error('[Refresh error]', error);
            }
        }

        // refresh 토큰 없을 시 / 토큰 갱신 실패 시 로그아웃한다.
        if (typeof window !== 'undefined') {
            // clearTokens();
            // if (window.location.pathname !== "/") {
            //   window.location.replace("/");
            // }
        }

        return Promise.reject(new Error('로그인을 연장할 수 없습니다.'));
    }
}

export default BaseApiClient;
