"use client";

import { Box, Button } from "@mui/material";
import React from "react";
import BasicLayout from "@/app/components/BasicLayout";
import Paper from "@mui/material/Paper";
// Component
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_BASE_URL, accessToken } from "@/app/utils";

interface DateFormat {
  dateFormat: {
    date: string;
    day: string;
  };
}
function getFormattedDate(): DateFormat {
  const today: Date = new Date();
  const year: number = today.getFullYear();
  const month: number = today.getMonth() + 1;
  const day: number = today.getDate();

  // 월과 일이 한 자리 숫자인 경우 앞에 0을 붙여 두 자리로 만듭니다.
  const formattedMonth: string = month < 10 ? "0" + month : month.toString();
  const formattedDay: string = day < 10 ? "0" + day : day.toString();

  // 요일 가져오기
  const dayOfWeek: number = today.getDay();
  const daysOfWeek: string[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const formattedDayOfWeek: string = daysOfWeek[dayOfWeek];

  return {
    dateFormat: {
      date: `${year}-${formattedMonth}-${formattedDay}`,
      day: formattedDayOfWeek,
    },
  };
}

function formatTime(time: string): string {
  const hour: string = time.substring(0, 2);
  const minute: string = time.substring(2);

  return `${hour}시 ${minute}분`;
}

const koreanDaysOfWeek: Record<string, string> = {
  SUNDAY: "일요일",
  MONDAY: "월요일",
  TUESDAY: "화요일",
  WEDNESDAY: "수요일",
  THURSDAY: "목요일",
  FRIDAY: "금요일",
  SATURDAY: "토요일",
};
const index = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const todayFormatted: DateFormat = getFormattedDate();

  const { data, refetch } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/schedules/attendanceId/${params.id}?days=TUESDAY&days=MONDAY&timeFrom=0900&timeTo=1830`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response?.data;
    },
  });

  const fetchRecord = async (attendeeId: string) =>
    await axios.post(
      `${API_BASE_URL}/records`,
      {
        attendanceId: params.id,
        status: "Present",
        attendeeId: attendeeId,
        date: todayFormatted.dateFormat.date,
        day: todayFormatted.dateFormat.day,
        lateReason: "",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

  const fetchAllRecord = async () => {
    await axios
      .post(
        `${API_BASE_URL}/create`,
        {
          attendanceId: params.id,
          status: "Present",
          date: new Date(todayFormatted.dateFormat.date),
          day: todayFormatted.dateFormat.day,
          lateReason: "",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        alert("전원 출석하였습니다");
        refetch();
      });
  };
  const { mutate } = useMutation(fetchRecord, {
    onSuccess: () => {
      alert("출석하였습니다.");
      refetch();
    },
    onError: () => {
      alert("오류 관리자에게 문의하세요.");
    },
  });

  return (
    <BasicLayout>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody></TableBody>
        </Table>
      </TableContainer>
      <br />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={5}>
                교회1 충무교회 청년부 주말 30
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" colSpan={5}>
                2024/02/05 (화) 출석 대상자 5명
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">이름</TableCell>
              <TableCell align="center">출석 상태</TableCell>
              <TableCell align="center">지각</TableCell>
              <TableCell align="center">등원시간</TableCell>
              <TableCell align="center">비고</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item: any) => (
              <TableRow
                key={item.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                hover
                style={{ cursor: "pointer" }}
              >
                <TableCell component="th" align="center" scope="row">
                  {item.id}
                </TableCell>
                <TableCell component="th" align="center" scope="row">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => mutate(data.attendeeId)}
                  >
                    출석
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => mutate(data.attendeeId)}
                  >
                    지각
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => mutate(data.attendeeId)}
                  >
                    결석
                  </Button>
                </TableCell>
                <TableCell align="center">{item.email}</TableCell>
                <TableCell align="center">
                  {koreanDaysOfWeek[item.day] + " "}
                  {formatTime(item.time)}
                </TableCell>
                <TableCell align="center">비고</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            fetchAllRecord();
          }}
        >
          전원 출석
        </Button>
        <Button variant="contained" color="primary" onClick={() => {}}>
          출석 통계
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            router.push(`/attendancy/roaster-management/${params.id}`);
          }}
        >
          명단 관리
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            router.push("/attendancy/settings");
          }}
        >
          출석부 설정
        </Button>
      </Box>
    </BasicLayout>
  );
};

export default index;
