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
import useUser from "@/app/hooks/useUser";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

const index = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const accessToken = Cookies.get("access-token");

  const { setUserInfo } = useUser();

  const { isLoading } = useQuery({
    queryKey: ["get-user-detail"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:12310/attendances/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response?.data.result;
    },
  });

  // Hook
  const onChange = (field: string, value: string) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // if (isLoading) return <CircularProgress color="inherit" />;
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
              <TableCell align="right">이름</TableCell>
              <TableCell align="right">출석 상태</TableCell>
              <TableCell align="right">지각</TableCell>
              <TableCell align="right">등원시간</TableCell>
              <TableCell align="right">비고</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {data?.map((item: Info) => (
              <TableRow
                key={item.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                hover
                style={{ cursor: "pointer" }}
                onClick={() => {
                  //   fetchUserDetail(item.id);
                  //   router.push(`/attendancy/list/${item.id}`);
                }}
              >
                <TableCell component="th" align="right" scope="row">
                  {item.id}
                </TableCell>
                <TableCell component="th" align="right" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.email}</TableCell>
                <TableCell align="right">{item.password}</TableCell>ㅈㄷㄱ33김ㅂ
                <TableCell align="right">비고</TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display={"flex"} justifyContent={"space-between"}>
        <Button variant="contained" color="primary" onClick={() => {}}>
          출석 체크
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
