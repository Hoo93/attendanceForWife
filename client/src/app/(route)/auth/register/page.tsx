"use client";

import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import React, { useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/utils/common";
import { pushNotification } from "@/app/utils/notification";

export interface Register {
  username: string;
  password: string;
  name: string;
  mobileNumber: string;
  birthday: {
    $d: string;
  };
  email: string;
}

function convertToBirthdate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear().toString().slice(2);
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

const index = () => {
  const router = useRouter();
  const [register, setRegister] = useState<Register>({
    username: "",
    password: "",
    name: "",
    mobileNumber: "",
    birthday: {
      $d: "",
    },
    email: "",
  });

  // Hook
  const onChange = (field: string, value: string | any) => {
    setRegister((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const fetchRegister = async (params: Register) => {
    const { username, password, mobileNumber, name, birthday, email } = params;
    await axios
      .post(
        `${API_BASE_URL}/auth/signup`,
        {
          username: username,
          password: password,
          mobileNumber: mobileNumber,
          birthday: convertToBirthdate(birthday.$d),
          name: name,
          email: email,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => res?.data.message);
  };

  const { mutate, data, isLoading } = useMutation(fetchRegister, {
    onSuccess: () => {
      pushNotification("회원가입이 되었습니다.", "success");
      router.push("/");
    },
    onError: (error) => {
      pushNotification("에러가 발생하였습니다.", "error");
    },
    onSettled: () => {},
  });
  if (isLoading) return <CircularProgress color="inherit" />;

  return (
    <div style={{ width: "500px" }}>
      <Box alignContent={"center"}>
        <Grid container spacing={1} alignItems={"center"}>
          <Grid item xs={5}>
            <div>이름</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              value={register?.name}
              fullWidth
              label={"이름"}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </Grid>

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
            <div>Email</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              value={register?.email}
              fullWidth
              label={"Email"}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </Grid>

          <Grid item xs={5}>
            <div>PW</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              type="password"
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
              value={register?.mobileNumber}
              fullWidth
              label={"Tel_no"}
              onChange={(e) => onChange("mobileNumber", e.target.value)}
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
          {/* <Grid item xs={5}>
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
          </Grid> */}
        </Grid>
        <Box mt={3} display={"flex"} justifyContent={"flex-end"} gap={"5px"}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              router.push("/");
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
