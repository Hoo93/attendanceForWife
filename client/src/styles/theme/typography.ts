import { Noto_Sans } from 'next/font/google';

export const NotoSansKr = Noto_Sans({
    weight: ['300', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap', // Font 로드 기간 동안 대체 font
});

const typography = {
    fontFamily: NotoSansKr.style.fontFamily,
};

export default typography;
