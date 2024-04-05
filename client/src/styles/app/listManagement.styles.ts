import styled from '@emotion/styled';
import { Colors } from '@/styles/globalStyles';

export const ListManagementContainer = styled.section`
    min-width: 393px;
    width: 100%;
    padding: 0 27px;
    position: relative;

    & > .attendance-header {
        width: 100%;
        position: fixed;
        top: 0;
        padding: 42px 0 12px;
        box-sizing: border-box;
        background: ${Colors.White};

        & > .attendance-img {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background-color: ${Colors.Gray40};
            margin-bottom: 12px;
        }

        & > .attendance-info {
            & > .name {
                font-size: 20px;
                font-weight: 600;
                color: ${Colors.Black01};
            }
        }
    }

    & > .attendance-list {
        display: flex;
        gap: 12px;
        flex-direction: column;
        padding: 12px 0 120px;
        margin-top: 125px;
    }

    & > .MuiFab-root {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 29px;
        bottom: 84px;
        border-radius: 24px;
        box-sizing: border-box;
        background-color: ${Colors.CheckureeGreen};
        box-shadow: none;
        cursor: pointer;

        &:hover {
            background-color: ${Colors.CheckureeGreen};
        }
    }
`;

export const AttendanceItemContainer = styled.div<{
    status: string;
    isDetailOpen: boolean;
}>`
    & > .attendance-item__container {
        width: 100%;
        height: 58px;
        padding: 9px 18px 10px;
        border: 1px solid ${Colors.CheckureeGreen};
        border-radius: 8px;
        box-sizing: border-box;
        background-color: ${Colors.White};

        & > .name {
            display: flex;
            gap: 4px;
            align-items: center;
            font-weight: 500;
        }

        & > .bottom-container {
            display: flex;
            align-items: center;
            justify-content: space-between;

            & > div {
                font-size: 12px;
                font-weight: 500;
                color: ${Colors.Gray80};
            }

            & > .status-container {
                display: flex;
                gap: 4px;

                & > .status {
                    display: flex;
                    gap: 2px;
                    align-items: center;

                    & > .count {
                        line-height: 14.34px;
                    }
                }
            }
        }
    }

    & > .detail-box {
        height: ${(props) => (props.isDetailOpen ? '104px' : 0)};
        padding: ${(props) => (props.isDetailOpen ? '4px' : 0)};
        border-radius: 8px;
        background-color: ${(props) =>
            props.status === '지각'
                ? Colors.Orange
                : props.status === '결석'
                  ? Colors.Red
                  : Colors.LightGreen};
        transition: height 0.2s ease-in;

        & > .detail-buttons {
            height: 24px;
            display: ${(props) => (props.isDetailOpen ? 'flex' : 'none')};
            line-height: 24px;
            margin-bottom: 4px;
        }

        & > .MuiTextField-root {
            width: 100%;

            & > .MuiInputBase-root {
                width: 100%;
                height: ${(props) =>
                    props.isDetailOpen
                        ? props.status === '지각' || props.status === '결석'
                            ? '68px'
                            : '96px'
                        : 0};
                padding: 0;
                border-radius: 4px;
                border: none;
                background: ${Colors.White};
                transition: height 0.2s ease-in;

                & > textarea {
                    height: ${(props) =>
                        props.isDetailOpen
                            ? props.status === '지각' || props.status === '결석'
                                ? '68px'
                                : '96px'
                            : 0} !important;
                    padding: 0 8px;
                    box-sizing: border-box;
                    font-size: 12px;
                    font-weight: 500;
                    transition: height 0.2s ease-in;
                }

                & > fieldset {
                    border: none;
                }
            }
        }
    }
`;
