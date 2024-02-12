"use client";

// Component
import { Box, Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";

import BasicLayout from "@/app/components/BasicLayout";
import CommonTable from "@/app/components/Table";
import Paper from "@mui/material/Paper";
// Component
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
// libraries
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Info {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface CommonTableProps {
  infoList: Info[];
}

const index = () => {
  const router = useRouter();
  // const { infoList, fetchInfoList } = useUser(); <- react query로 인한 주석

  const { isLoading, data, isError } = useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/api/users");
      return response?.data.result;
    },
  });

  if (isLoading) return <CircularProgress color="inherit" />;
  if (isError) return <>에러..</>;

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
            {data?.map((item: Info) => (
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
                <TableCell align="right">{item.password}</TableCell>
                <TableCell align="right">비고</TableCell>
              </TableRow>
            ))}
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
        <Button variant="contained" color="primary" onClick={() => {}}>
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
