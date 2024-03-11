import Cookies from "js-cookie";

export const DateUtil = ({ url }: { url: string }) => {
  const originalDate: Date = new Date(url);

  // 년, 월, 일 정보 추출
  const year: number = originalDate.getFullYear();
  const month: number = originalDate.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
  const day: number = originalDate.getDate();

  // 월과 일이 한 자리 숫자일 경우 앞에 0을 붙이기
  const formattedMonth: string = month < 10 ? "0" + month : month.toString();
  const formattedDay: string = day < 10 ? "0" + day : day.toString();

  // 포맷팅된 날짜 문자열 생성
  const formattedDateString: string = `${year}-${formattedMonth}-${formattedDay}`;

  return formattedDateString;
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_ROOT;

export const accessToken = Cookies.get("access-token");
