// Libraries
import React, { useState } from "react";

import Paper from "@mui/material/Paper";
// Component
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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

const CommonTable: React.FC<CommonTableProps> = ({ infoList }) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<Info>({
    id: 0,
    name: "",
    email: "",
    password: "",
  });

  const fetchUserDetail = async (id: number) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    setUserInfo(data.result);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID 번호</TableCell>
            <TableCell align="right">이름</TableCell>
            <TableCell align="right">이메일</TableCell>
            <TableCell align="right">비밀번호</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {infoList?.map((item: Info) => (
            <TableRow
              key={item.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              hover
              style={{ cursor: "pointer" }}
              onClick={() => {
                fetchUserDetail(item.id);
                router.push(`/attendancy/list/${item.id}`);
              }}
            >
              <TableCell component="th" scope="row">
                {item.id}
              </TableCell>
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell align="right">{item.email}</TableCell>
              <TableCell align="right">{item.password}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommonTable;
