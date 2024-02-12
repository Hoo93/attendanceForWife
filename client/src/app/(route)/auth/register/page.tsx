"use client";

import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import  DateUtil from "@/app/utils";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import FormControlLabel from "@mui/material/FormControlLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useRouter } from "next/navigation";

export interface Register {
  id: string;
  password: string;
  phone: string;
  birthday: {
    $d : string;
  };
  sex: string;
}

const index = () => {
  const router = useRouter();
  const [login, setLogin] = useState<Register>({
    id: "",
    password: "",
    phone: "",
    birthday: {
      $d:""
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

  console.log(login);
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
              value={login?.id}
              fullWidth
              label={"ID"}
              onChange={(e) => onChange("id", e.target.value)}
            />
          </Grid>

          <Grid item xs={5}>
            <div>PW</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              value={login?.password}
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
              value={login?.phone}
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
              <DatePicker   label="Controlled picker"
                value={login?.birthday}
                onChange={(e) => onChange("birthday",e)} 
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
              onChange={(e) => onChange("sex",e.target.value)}
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
              alert("회원가입 되었습니다.");
              router.push("/auth/login");
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
