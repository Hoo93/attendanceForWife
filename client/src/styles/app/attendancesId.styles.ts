import styled from '@emotion/styled';
import { Colors } from '@/styles/globalStyles';

export const AttendanceIdContainer = styled.section`
    width: 393px;
    padding: 0 27px;

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
        padding: 12px 0 120px;
        margin-top: 157px;
    }
`;

export const AttendanceItemContainer = styled.div<{
    status: string;
    isDetailOpen: boolean;
}>`
    & > .attendance-item__container {
        width: 339px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px 0 18px;
        border: ${(props) =>
            props.status === ''
                ? `1px solid ${Colors.CheckureeGreen}`
                : 'none'};
        border-radius: 8px;
        box-sizing: border-box;
        background-color: ${(props) => {
            if (props.status === '출석') return Colors.LightGreen;
            if (props.status === '지각') return Colors.Orange;
            if (props.status === '결석') return Colors.Red;
            return Colors.White;
        }};
        margin-bottom: ${(props) => (props.isDetailOpen ? '4px' : 0)};

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

export const StatusButton = styled.div<{ isSelected: boolean }>`
    width: 54px;
    height: 32px;
    border-radius: 21px;
    box-sizing: border-box;
    font-weight: 500;
    text-align: center;
    line-height: 32px;
    color: ${(props) => (props.isSelected ? Colors.White : Colors.Black01)};
    background-color: ${(props) => (props.isSelected ? Colors.Black01 : '')};
    cursor: pointer;
`;

export const DetailButton = styled.div<{ isSelected: boolean }>`
    width: fit-content;
    padding: 0 12px;
    border-radius: 44px;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    color: ${(props) => (props.isSelected ? Colors.White : Colors.Black01)};
    background-color: ${(props) => (props.isSelected ? Colors.Black01 : '')};
    cursor: pointer;
`;
