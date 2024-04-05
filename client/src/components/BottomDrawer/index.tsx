'use client';

import React from 'react';

// Components
import { Drawer } from '@mui/material';
import { Global } from '@emotion/react';
import { css } from '@emotion/css';

// Types
interface PropsType {
    open: boolean;
    onClose: () => void;
}

const BottomDrawer = ({ open, onClose }: PropsType) => {
    return (
        <>
            <Global
                styles={css`
                    body {
                        background-color: pink;
                    }
                    .MuiPaper-root {
                        border-top-left-radius: 32px;
                        border-top-right-radius: 32px;
                    }
                `}
            />
            <Drawer anchor="bottom" open={open} onClose={onClose}>
                <div>hihi</div>
            </Drawer>
        </>
    );
};

export default BottomDrawer;
