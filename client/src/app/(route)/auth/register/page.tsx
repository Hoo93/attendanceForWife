"use client";
import { Box, Grid, TextField, Button } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BasicDatePicker from "@/app/components/DatePicker";

export interface Register {
  id: string;
  pw: string;
  phone: string;
  age: string;
  sex: string;
}

const index = () => {
  const router = useRouter();

  const [login, setLogin] = useState<Register>({
    id: "",
    pw: "",
    phone: "",
    age: "",
    sex: "",
  });

  // Hook
  const onChange = (field: string, value: string) => {
    setLogin((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

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
              onChange={(e) => onChange("id", e.target.value)}
            />
          </Grid>

          <Grid item xs={5}>
            <div>PW</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              value={login?.pw}
              fullWidth
              onChange={(e) => onChange("pw", e.target.value)}
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
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </Grid>
          <Grid item xs={5}>
            <div>Age</div>
          </Grid>
          <Grid item xs={7}>
            <BasicDatePicker />
          </Grid>
          <Grid item xs={5}>
            <div>Gender</div>
          </Grid>
          <Grid item xs={7}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
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
