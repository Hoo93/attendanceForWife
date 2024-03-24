import { NextRequest, NextResponse } from 'next/server';

import { safeJwtDecode } from './libs/jwt';

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';

const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

const PRIVATE_PATHS = ['/attendancy'];

export default async function handler(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    const accessToken = req.cookies.get(ACCESS_TOKEN_KEY);
    const refreshToken = req.cookies.get(REFRESH_TOKEN_KEY);

    // 로그인 / 회원가입 페이지의 경우 로그인 되어 있을 시 메인으로 보낸다.
    if (accessToken != null && pathname === '/') {
        return NextResponse.redirect(origin + '/attendancy/list');
    }

    // 비공개 route의 경우 로그인 되어 있지 않을 시 로그인 페이지로 보낸다.
    if (
        accessToken == null &&
        PRIVATE_PATHS.some((path) => pathname.startsWith(path))
    ) {
        // return NextResponse.redirect(
        //   `${origin}?redirect_uri=` + encodeURIComponent(req.url)
        // );
    }

    // 토큰 만료시 (refresh)
    const decoded = await safeJwtDecode(String(accessToken?.value));
    if (decoded?.exp != null && decoded.exp * 1000 <= Date.now()) {
        if (refreshToken != null) {
            try {
                // edge runtime에서는 fetch만 사용 가능합니다.
                const result = await fetch(
                    process.env.NEXT_PUBLIC_API_ROOT + '/auth/refresh-token',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            refreshToken,
                        }),
                    }
                ).then((response) => response.json());

                // 새로운 토큰으로 request를 rewrite한다.
                req.cookies.set(
                    ACCESS_TOKEN_KEY,
                    result.data.data!.accessToken
                );
                req.cookies.set(
                    REFRESH_TOKEN_KEY,
                    result.data.data!.refreshToken
                );
                const res = NextResponse.next({
                    request: req,
                });

                // 새로운 토큰들로 쿠키를 설정한다.
                res.cookies.set(
                    ACCESS_TOKEN_KEY,
                    result.data.data!.accessToken
                );
                res.cookies.set(
                    REFRESH_TOKEN_KEY,
                    result.data.data!.refreshToken
                );
                return res;
            } catch (error) {
                // 계정이 삭제된 경우 등 에러시 skip
            }
        }

        req.cookies.delete(ACCESS_TOKEN_KEY);
        req.cookies.delete(REFRESH_TOKEN_KEY);
        const res = NextResponse.next({
            request: req,
        });
        // 토큰을 cookie에서 삭제한다.
        res.cookies.delete(ACCESS_TOKEN_KEY);
        res.cookies.delete(REFRESH_TOKEN_KEY);
        return res;
    }

    return NextResponse.next();
}
