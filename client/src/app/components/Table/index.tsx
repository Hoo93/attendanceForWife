import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
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
import Cookies from "js-cookie";
import { API_BASE_URL, accessToken } from "@/app/utils";

interface Info {
  attendanceId: number;
  name: string;
  email: string;
  password: string;
  attendance: {
    title: string;
    description: string;
    type: string;
  };
}

interface listCreate {
  title: string; // 이름
  description: string; // 출석 상태
  type: string; // 지각
}

interface CommonTableProps {
  infoList: any;
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
    title: "",
    description: "",
    type: "",
  });

  const fetchListCreate = async (params: listCreate) => {
    const { title, description, type } = params;
    await axios.post(
      `${API_BASE_URL}/attendances`,
      {
        title: title,
        description: description,
        type: type,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  };

  const { mutate, data } = useMutation(fetchListCreate, {
    onSuccess: () => {
      alert("생성 되었습니다.");
      setIsCreate(false);
    },
    onError: () => {
      alert("빈칸을 전부 채워주세요");
    },
  });

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
            <TableCell align="center">출석부 이름</TableCell>
            <TableCell align="center">설명</TableCell>
            <TableCell align="center">타입</TableCell>
            <TableCell align="center">총원</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {infoList?.map((item: Info, index: number) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              hover
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.push(`/attendancy/list/${item.attendanceId}`);
              }}
            >
              <TableCell component="th" scope="row" align="center">
                {item.attendance.title}
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {" "}
                {item.attendance.description}
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {item.attendance.type === "weekday" ? "평일부" : "주말부"}
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                0
              </TableCell>
            </TableRow>
          ))}
          <TableRow
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            style={{ cursor: "pointer" }}
          >
            {isCreate ? (
              <>
                <TableCell component="th" scope="row">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      mutate(listCreate);
                    }}
                  >
                    저장
                  </Button>
                </TableCell>
                <TableCell component="th" scope="row">
                  <TextField
                    id="outlined-basic"
                    label="출석부 이름"
                    variant="outlined"
                    value={listCreate?.title}
                    onChange={(e) => onChange("title", e.target.value)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <TextField
                    id="outlined-basic"
                    label="출석부 설명"
                    variant="outlined"
                    value={listCreate?.description}
                    onChange={(e) => onChange("description", e.target.value)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {/* <TextField
                    id="outlined-basic"
                    label="타입"
                    variant="outlined"
                    value={listCreate?.type}
                    onChange={(e) => onChange("type", e.target.value)}
                  /> */}
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={(e) => onChange("type", e.target.value)}
                  >
                    <FormControlLabel
                      value="weekday"
                      control={<Radio />}
                      label="평일부"
                    />
                    <FormControlLabel
                      value="weeken"
                      control={<Radio />}
                      label="주말부"
                    />
                  </RadioGroup>
                </TableCell>
              </>
            ) : (
              <TableCell
                component="th"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                onClick={() => setIsCreate(true)}
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
