'use client';

import { createTheme } from '@mui/material';
import customTypography from './typography';

const theme = createTheme({
    breakpoints: {
        //TODO: 반응형 지정 <- 나중에 MUI 반응형 쓸거면?
    },
    typography: {
        ...customTypography,
    },

    components: {
        //TODO: custom 컴포넌트 지정
    },
});

export default theme;
