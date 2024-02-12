"use client";
import { Box, Grid, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export interface Login {
  id: string;
  pw: string;
}

const index = () => {
  const router = useRouter();

  const [login, setLogin] = useState<Login>({
    id: "",
    pw: "",
  });

  // Hook
  const onChange = (field: string, value: string) => {
    setLogin((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <>
      <Box>
        <Grid container spacing={1} alignItems={"center"}>
          <Grid item xs={12} textAlign={"center"} marginBottom={"20px"}>
            <Button fullWidth variant="contained">
              출석이 로그인
            </Button>
          </Grid>
          <Grid item xs={5}>
            <div>ID</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              value={login?.id}
              // disabled={isUpdate ? false : true}
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
        </Grid>
        <Box mt={3} display={"flex"} justifyContent={"flex-end"} gap={"5px"}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              alert("로그인 되었습니다");
              router.push("/attendancy/list");
            }}
          >
            로그인
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              router.push("/auth/register");
            }}
          >
            회원가입
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default index;
