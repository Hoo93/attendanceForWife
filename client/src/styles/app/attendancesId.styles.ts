import styled from '@emotion/styled';
import { Colors } from '@/styles/globalStyles';

const AttendanceIdContainer = styled.section`
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

        & > .attendance-status {
        }
    }

    & > .attendance-list {
        border: 1px solid blue;
        padding-top: 12px;
    }
`;

export default AttendanceIdContainer;
