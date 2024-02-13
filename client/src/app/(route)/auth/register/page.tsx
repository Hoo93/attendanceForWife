"use client";

import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import React, { useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import FormControlLabel from "@mui/material/FormControlLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export interface Register {
  username: string;
  password: string;
  phone: string;
  birthday: {
    $d: string;
  };
  sex: string;
}

const index = () => {
  const router = useRouter();
  const [register, setRegister] = useState<Register>({
    username: "",
    password: "",
    phone: "",
    birthday: {
      $d: "",
    },
    sex: "",
  });

  // Hook
  const onChange = (field: string, value: string | any) => {
    setRegister((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const fetchRegister = async (params: Register) => {
    const { username, password, phone, birthday, sex } = params;
    await axios.post(
      "http://localhost:12310/auth/signup",
      {
        username: username,
        password: password,
        phone: phone,
        birthday: birthday.$d,
        sex: sex,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  const { mutate, data, isLoading } = useMutation(fetchRegister, {
    onSuccess: (data, variables, context) => {
      alert("회원가입이 되었습니다.");
      router.push("/auth/login");
    },
    onError: (error, variables, context) => {
      alert("빈칸없이 전부 입력해주세요.");
    },
    onSettled: (data, error, variables, context) => {},
  });
  if (isLoading) return <CircularProgress color="inherit" />;

  return (
    <div style={{ width: "500px" }}>
      <Box alignContent={"center"}>
        <Grid container spacing={1} alignItems={"center"}>
          <Grid item xs={5}>
            <div>ID</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              value={register?.username}
              fullWidth
              label={"ID"}
              onChange={(e) => onChange("username", e.target.value)}
            />
          </Grid>

          <Grid item xs={5}>
            <div>PW</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              value={register?.password}
              fullWidth
              label={"PW"}
              onChange={(e) => onChange("password", e.target.value)}
            />
          </Grid>
          <Grid item xs={5}>
            <div>Phone</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              value={register?.phone}
              fullWidth
              label={"Tel_no"}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </Grid>
          <Grid item xs={5}>
            <div>Birthday</div>
          </Grid>
          <Grid item xs={7}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Controlled picker"
                  value={register?.birthday}
                  onChange={(e) => onChange("birthday", e)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={5}>
            <div>Gender</div>
          </Grid>
          <Grid item xs={7}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(e) => onChange("sex", e.target.value)}
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="여성"
              />
              <FormControlLabel value="male" control={<Radio />} label="남성" />
              <FormControlLabel
                value="gay"
                control={<Radio />}
                label="동성애자"
              />
            </RadioGroup>
          </Grid>
        </Grid>
        <Box mt={3} display={"flex"} justifyContent={"flex-end"} gap={"5px"}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              router.push("/auth/login");
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              mutate(register);
            }}
          >
            저장
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default index;
