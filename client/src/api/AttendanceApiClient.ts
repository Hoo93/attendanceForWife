import BaseApiClient, { Tokens } from './BaseApiClient';

export interface ICommonResponse<T> {
    code: number;
    message: string;
    result?: T;
}

/**
 * 페이지 데이터 오브젝트 타입
 */
export interface IPage<T> {
    data: T[];
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage?: number;
    prevPage?: number;
}

class AttendanceApiClient extends BaseApiClient {
    private static instance: AttendanceApiClient;

    public constructor(tokens?: Tokens) {
        super(process.env.NEXT_PUBLIC_API_ROOT!, tokens);
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new AttendanceApiClient();
        }
        return this.instance;
    }

    public getAttendanceList = () =>
        this.axios.request({
            method: 'GET',
            url: '/attendances',
        });

    public getAttendanceDetailList = (id: string) =>
        this.axios.request({
            method: 'GET',
            url: `/schedules/attendanceId/${id}?days=TUESDAY&days=MONDAY&timeFrom=0900&timeTo=1830`,
        });
}

export default AttendanceApiClient;
