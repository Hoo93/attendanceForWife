"use client";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import BasicLayout from "@/app/components/BasicLayout";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TextField } from "@mui/material";

import ClassScheduleContainer from "@/app/components/Schedule";
import { API_BASE_URL, accessToken } from "@/app/utils/common";
import { pushNotification } from "@/app/utils/notification";

interface RoasterData {
  name: string;
  age: string;
  mobileNumber: string;
  subMobileNumber: string;
  description: string;
  attendanceId: string;
}

const Index = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [roaster, setRoaster] = useState<RoasterData>({
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

  const fetchScheduleCreate = async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/schedules`, {
      attendanceId: data.data.attendanceId,
      attendeeId: data.data.id,
      day: "TUESDAY",
      time: "0930",
    });
  };
  const fetchRoasterCreate = async (params: RoasterData) => {
    const {
      name,
      age,
      mobileNumber,
      subMobileNumber,
      description,
      attendanceId,
    } = params;
    const response = await axios.post(`${API_BASE_URL}/attendees`, {
      name: name,
      age: age,
      mobileNumber: mobileNumber,
      subMobileNumber: subMobileNumber,
      description: description,
      attendanceId: attendanceId,
    });
    return response;
  };

  const { mutate } = useMutation({
    mutationKey: ["roaster-list"],
    mutationFn: fetchRoasterCreate,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["roaster-list"]);
      fetchScheduleCreate(data);
      pushNotification("생성되었습니다.", "success");
      setIsCreate(false);
    },
    onError: () => {
      pushNotification("생성에 실패하였습니다.", "error");
      setIsCreate(false);
      setRoaster({
        name: "",
        age: "",
        mobileNumber: "",
        subMobileNumber: "",
        description: "",
        attendanceId: params.id,
      });
    },
  });

  const { isLoading, data: roasterData } = useQuery({
    queryKey: ["roaster-list", params.id],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/attendees/attendanceId/${params.id}`
      );
      return response?.data[0];
    },
  });

  if (isLoading) return <CircularProgress color="inherit" />;

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
                {/* <TableCell>스케줄</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {roasterData?.map((item: RoasterData, index: number) => (
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
                  {/* <TableCell>{item.description}</TableCell> */}
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
                        label="휴대폰 번호"
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
                        label="서브 휴대폰 번호"
                        variant="outlined"
                        value={roaster?.subMobileNumber}
                        onChange={(e) =>
                          onChange("subMobileNumber", e.target.value)
                        }
                      />
                    </TableCell>
                    {/* <TableCell component="th" scope="row">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        스케줄
                      </Button>
                    </TableCell> */}
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

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <ClassScheduleContainer />
        </Dialog>
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
          <Box mt={2} display={"flex"} gap={"5px"}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                pushNotification("삭제하실 명단을 선택해주세요.", "error");
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
  );
};

export default Index;

const BoxST = styled(Box)(({ theme }) => {
  return {
    padding: "24px 32px",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      padding: "48px 40px",
    },
  };
});
