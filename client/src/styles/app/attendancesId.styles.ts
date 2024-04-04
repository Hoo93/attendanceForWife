import styled from '@emotion/styled';
import { Colors } from '@/styles/globalStyles';

export const AttendanceIdContainer = styled.section`
    width: 393px;
    padding: 42px 27px 0;

    & > .attendance-header {
        padding-bottom: 12px;

        & > .attendance-img {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background-color: ${Colors.Gray40};
            margin-bottom: 12px;
        }

        & > .attendance-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;

            & > .name {
                font-size: 20px;
                font-weight: 600;
                color: ${Colors.Black01};
            }

            & > .date-container {
                width: 71px;
                height: 23px;
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                border-radius: 4px;
                box-sizing: border-box;
                background-color: ${Colors.Gray40};

                & > .date {
                    width: 21px;
                    height: 19px;
                    border-radius: 2px;
                    box-sizing: border-box;
                    font-size: 14px;
                    text-align: center;
                    line-height: 19px;
                    background-color: ${Colors.White};
                }
            }
        }

        & > .attendance-status-container {
            display: flex;
            gap: 4px;

            & > .status {
                display: flex;
                gap: 2px;
                align-items: center;

                & > .count {
                    font-size: 12px;
                    font-weight: 500;
                    color: ${Colors.Gray80};
                }
            }
        }
    }

    & > .attendance-list {
        display: flex;
        gap: 12px;
        flex-direction: column;
        padding-top: 12px;
    }
`;

export const AttendanceItemContainer = styled.div<{ status: string }>`
    & > .attendance-item__container {
        width: 339px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px 0 18px;
        border-radius: 8px;
        box-sizing: border-box;
        background-color: ${(props) =>
            props.status === '지각'
                ? Colors.Orange
                : props.status === '결석'
                  ? Colors.Red
                  : Colors.LightGreen};
        margin-bottom: 4px;

        & > .name {
            display: flex;
            gap: 4px;
            align-items: center;
            font-weight: 500;

            & > img {
                cursor: pointer;
            }
        }

        & > .status-buttons {
            width: 154px;
            display: flex;
            justify-content: space-between;
        }
    }

    & > .detail-box {
        min-height: 104px;
        padding: 4px;
        border-radius: 8px;
        background-color: ${(props) =>
            props.status === '지각'
                ? Colors.Orange
                : props.status === '결석'
                  ? Colors.Red
                  : Colors.LightGreen};

        & > .detail-buttons {
            height: 24px;
            display: flex;
            line-height: 24px;
            margin-bottom: 4px;

            & > .detail-button {
                width: 49px;
                font-size: 12px;
                font-weight: 500;
            }
        }

        & > .MuiTextField-root {
            width: 100%;

            & > .MuiInputBase-root {
                width: 100%;
                height: ${(props) =>
                    props.status === '지각' || props.status === '결석'
                        ? '68px'
                        : '96px'};
                padding: 0;
                border-radius: 4px;
                border: none;
                background: ${Colors.White};

                & > textarea {
                    padding: 0 8px;
                    box-sizing: border-box;
                    font-size: 12px;
                    font-weight: 500;
                }

                & > fieldset {
                    border: none;
                }
            }
        }
    }
`;

export const StatusButton = styled.div<{ isSelected: boolean }>`
    width: 54px;
    height: 32px;
    border-radius: 21px;
    box-sizing: border-box;
    font-weight: 500;
    text-align: center;
    line-height: 32px;
    color: ${(props) => (props.isSelected ? Colors.White : Colors.Black)};
    background-color: ${(props) => (props.isSelected ? Colors.Black01 : '')};
    cursor: pointer;
`;
