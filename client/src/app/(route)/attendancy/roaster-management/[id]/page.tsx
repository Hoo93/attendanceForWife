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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
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
import Cookies from "js-cookie";

interface Info {
  name: string;
  mobileNumber: string;
  age: string;
  subMobileNumber: string;
  description: string;
  attendanceId: string;
}

interface CommonTableProps {
  isCreate: boolean;
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

const Index: React.FC<CommonTableProps> = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const accessToken = Cookies.get("access-token");
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [roaster, setRoaster] = useState({
    // 타입 지정 해야힘
    name: "",
    age: "",
    mobileNumber: "",
    subMobileNumber: "",
    description: "",
    attendanceId: params.id,
  });

  // Hook
  const onChange = (field: string, value: string | any) => {
    setRoaster((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const fetchRoasterCreate = async (params: Info) => {
    const {
      name,
      age,
      mobileNumber,
      subMobileNumber,
      description,
      attendanceId,
    } = params;
    await axios.post(
      "http://localhost:12310/attendees",
      {
        name: name,
        age: age,
        mobileNumber: mobileNumber,
        subMobileNumber: subMobileNumber,
        description: description,
        attendanceId: attendanceId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  };

  const { mutate } = useMutation(fetchRoasterCreate, {
    onSuccess: () => {
      alert("등록되었습니다.");
      setIsCreate(false);
    },
    onError: () => {
      alert("빈칸을 전부 채워주세요");
    },
  });

  const { isLoading, data } = useQuery({
    queryKey: ["get-user", params.id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:12310/attendees/attendanceId/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response?.data[0];
    },
  });

  if (isLoading) return <CircularProgress color="inherit" />;

  console.log(data);
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
                <TableCell>휴대폰번호</TableCell>
                <TableCell>서브휴대폰번호</TableCell>
                <TableCell>설명</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((item: Info, index: number) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  hover
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    // router.push(`/attendancy/list/${item.id}`);
                  }}
                >
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {item.age}
                  </TableCell>
                  <TableCell>{item.mobileNumber}</TableCell>
                  <TableCell>{item.subMobileNumber}</TableCell>
                  <TableCell>{item.description}</TableCell>
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
                        value={roaster?.name}
                        onChange={(e) => onChange("name", e.target.value)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TextField
                        id="outlined-basic"
                        label="나이"
                        variant="outlined"
                        value={roaster?.age}
                        onChange={(e) => onChange("age", e.target.value)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TextField
                        id="outlined-basic"
                        label="mobileNumber"
                        variant="outlined"
                        value={roaster?.mobileNumber}
                        onChange={(e) =>
                          onChange("mobileNumber", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TextField
                        id="outlined-basic"
                        label="subMobileNumber"
                        variant="outlined"
                        value={roaster?.subMobileNumber}
                        onChange={(e) =>
                          onChange("subMobileNumber", e.target.value)
                        }
                      />
                    </TableCell>
                    {/* <TableCell component="th" scope="row">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            label="Controlled picker"
                            value={login?.birthday}
                            onChange={(e) => onChange("birthday", e)}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </TableCell> */}
                    <TableCell component="th" scope="row">
                      <TextField
                        id="outlined-basic"
                        label="description"
                        variant="outlined"
                        value={roaster?.description}
                        onChange={(e) =>
                          onChange("description", e.target.value)
                        }
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
                    <AddIcon /> <p>학생 등록하기</p>
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
                  mutate(roaster);
                }}
              >
                저장
              </Button>
            </Box>
          </div>
        ) : (
          // <Box mt={2}>
          //   <Button
          //     variant="contained"
          //     color="error"
          //     onClick={() => {
          //       setIsCreate(false);
          //     }}
          //   >
          //     삭제
          //   </Button>
          // </Box>
          <Box mt={2} display={"flex"} gap={"5px"}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                alert("삭제하실 명단을 선택해주세요.");
              }}
            >
              삭제
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                router.back();
              }}
            >
              대시보드
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
