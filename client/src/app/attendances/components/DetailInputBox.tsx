'use client';

import React from 'react';

// Types
import { AttendanceItemType } from '@/app/attendances/[id]/page';
import { TextField } from '@mui/material';

const DetailInputBox = ({ item }: { item: AttendanceItemType }) => {
    const detailOptions = {
        // TODO: api 연동 이후 영어로 변경 필요
        지각: [
            { label: '5분', value: '5' },
            { label: '10분', value: '10' },
            { label: '15분', value: '15' },
            { label: '20분 이상', value: '20' },
        ],
        결석: [
            { label: '공결', value: '5' },
            { label: '병결', value: '10' },
            { label: '무단', value: '15' },
            { label: '기타', value: '20' },
        ],
    };

    return (
        <div className="detail-box">
            {item.status === '지각' ? (
                <div className="detail-buttons">
                    {detailOptions.지각.map((item) => (
                        <div className="detail-button">{item.label}</div>
                    ))}
                </div>
            ) : item.status === '결석' ? (
                <div className="detail-buttons">
                    {detailOptions.결석.map((item) => (
                        <div className="detail-button">{item.label}</div>
                    ))}
                </div>
            ) : null}
            <TextField rows={item.status === '출석' ? 4 : 3} multiline />
        </div>
    );
};

export default DetailInputBox;
