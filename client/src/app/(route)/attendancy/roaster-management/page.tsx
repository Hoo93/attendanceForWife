"use client";

import {
  Box,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import BasicLayout from "@/app/components/BasicLayout";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Info {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface CommonTableProps {
  infoList: Info[];
  isCreate: boolean;
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

const Index: React.FC<CommonTableProps> = () => {
  const router = useRouter();
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [login, setLogin] = useState({
    // 타입 지정 해야힘
    id: "",
    password: "",
    phone: "",
    birthday: {
      $d: "",
    },
    sex: "",
  });

  // Hook
  const onChange = (field: string, value: string | any) => {
    setLogin((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const { isLoading, data, isError } = useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/api/users");
      return response?.data.result;
    },
  });
  // {loading && <CircularProgress color="inherit" />}
  if (isLoading) return <CircularProgress color="inherit" />;
  if (isError) return <>에러..</>;

  return (
    <BasicLayout>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding={isSmallScreen ? 2 : 4}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>나이</TableCell>
                <TableCell>성별</TableCell>
                <TableCell>출석요일</TableCell>
                <TableCell>비고</TableCell>
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
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TextField
                        id="outlined-basic"
                        label="나이"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TextField
                        id="outlined-basic"
                        label="성별"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            label="Controlled picker"
                            value={login?.birthday}
                            onChange={(e) => onChange("birthday", e)}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TextField
                        id="outlined-basic"
                        label="비고"
                        variant="outlined"
                      />
                    </TableCell>
                  </>
                ) : (
                  <TableCell
                    component="th"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    onClick={() => setIsCreate(true)}
                  >
                    <AddIcon /> <p>등록하기</p>
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {isCreate ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <Box mt={2}>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setIsCreate(false);
                }}
              >
                취소
              </Button>
            </Box>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  alert("저장되었습니다");
                  setIsCreate(false);
                }}
              >
                저장
              </Button>
            </Box>
          </div>
        ) : (
          <Box mt={2}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setIsCreate(false);
              }}
            >
              삭제
            </Button>
          </Box>
        )}
      </Box>
    </BasicLayout>
    // <Grid container display={"flex"} justifyContent={"space-around"}>
    //   <Grid item xs={12} md={6}>

    //   </Grid>
    // </Grid>
  );
};

export default Index;
