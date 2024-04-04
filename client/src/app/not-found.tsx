'use client';

// Next
import Link from 'next/link';
import Image from 'next/image';

// Styles
import styled from '@emotion/styled';
import { Images } from '@/styles/globalStyles';

const NotFoundContainer = styled.section`
    width: 393px;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 80px;

    & > img {
        width: 90%;
        height: 100px;
        margin-bottom: 32px;
    }

    & > h2 {
        text-align: center;
        margin-bottom: 48px;
    }

    & > div {
        font-size: 18px;

        & > a {
            font-weight: 600;
            color: darkgreen;
            text-underline-position: under;
        }
    }
`;

const NotFound = () => {
    return (
        <NotFoundContainer>
            <Image src={Images.Logo} alt={'logo'} />

            <h2>
                죄송합니다.
                <br />
                해당 페이지를 찾을 수 없습니다.
            </h2>

            <div>
                출석부로 돌아가시려면 <Link href={'/attendances'}>여기</Link>를
                눌러주세요!
            </div>
        </NotFoundContainer>
    );
};

export default NotFound;
