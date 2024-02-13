import { CircularProgress, TextField } from "@mui/material";
// Libraries
import React, { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
// Component
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Info {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface listCreate {
  a: string; // 이름
  b: string; // 출석 상태
  c: string; // 지각
  d: string; // 등원시간
  e: string; // 비고
}

interface CommonTableProps {
  infoList: Info[];
  isCreate: boolean;
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommonTable: React.FC<CommonTableProps> = ({
  infoList,
  isCreate,
  setIsCreate,
}) => {
  const router = useRouter();

  const [listCreate, setListCreate] = useState<listCreate>({
    a: "",
    b: "",
    c: "",
    d: "",
    e: "",
  });

  // const fetchListCreate = async (params: listCreate) => {
  //   const { username, password } = params;
  //   await axios.post(
  //     "http://localhost:12310/",
  //     {
  //       username: username,
  //       password: password,
  //     },
  //     {
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );
  // };

  // const { mutate, data, isLoading } = useMutation(fetchListCreate, {
  //   onSuccess: (data, variables, context) => {
  //     alert("로그인 되었습니다.");
  //     router.push("/attendancy/list");
  //   },
  //   onError: (error, variables, context) => {
  //     alert("존재하지 않는 계정이거나 비밀번호가 다릅니다.");
  //   },
  //   onSettled: (data, error, variables, context) => {},
  // });

  // Hook
  const onChange = (field: string, value: string) => {
    setListCreate((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // if (isLoading) return <CircularProgress color="inherit" />;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>이름</TableCell>
            <TableCell>출석 상태</TableCell>
            <TableCell>지각</TableCell>
            <TableCell>등원시간</TableCell>
            <TableCell>비고</TableCell>
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
                router.push(`/attendancy/list/${item.id}`);
              }}
            >
              <TableCell component="th" scope="row">
                {item.id}
              </TableCell>
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.password}</TableCell>
              <TableCell>비고</TableCell>
            </TableRow>
          ))}
          <TableRow
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            style={{ cursor: "pointer" }}
          >
            {isCreate ? (
              <>
                <TableCell component="th" scope="row">
                  <TextField
                    id="outlined-basic"
                    label="이름"
                    variant="outlined"
                    // value={login?.username}
                    // onChange={(e) => onChange("username", e.target.value)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <TextField
                    id="outlined-basic"
                    label="출석 상태"
                    variant="outlined"
                    // value={login?.username}
                    // onChange={(e) => onChange("username", e.target.value)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <TextField
                    id="outlined-basic"
                    label="지각"
                    variant="outlined"
                    // value={login?.username}
                    // onChange={(e) => onChange("username", e.target.value)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <TextField
                    id="outlined-basic"
                    label="등원시간"
                    variant="outlined"
                    // value={login?.username}
                    // onChange={(e) => onChange("username", e.target.value)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <TextField
                    id="outlined-basic"
                    label="비고"
                    variant="outlined"
                    // value={login?.username}
                    // onChange={(e) => onChange("username", e.target.value)}
                  />
                </TableCell>
              </>
            ) : (
              <TableCell
                component="th"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                // onClick={() =>  mutate(listCreate);}
              >
                <AddIcon /> <p>생성</p>
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommonTable;
