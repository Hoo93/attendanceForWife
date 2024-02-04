"use client";

import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";

import { useRouter } from "next/navigation";
import useUser from "@/app/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const index = () => {
  const router = useRouter();
  let currentUrl: string;
  let id: number;

  if (typeof window !== "undefined") {
    currentUrl = window.location.pathname;
    id = Number(currentUrl.split("/").pop());
  }

  const {
    fetchUserUpdate,
    fetchUserDetail,
    fetchUserDelete,
    setUserInfo,
    setIsUpdate,
    isUpdate,
    userInfo,
  } = useUser();

  const { isLoading, data, isError } = useQuery({
    queryKey: ["get-user-detail"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        url: `http://localhost:3000/api/users/${id}`,
        headers: { "Content-Type": "application/json" },
      });
      return response?.data.result;
    },
  });

  // Hook
  const onChange = (field: string, value: string) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  console.log(data);

  if (isLoading) return <>Loading...</>;
  else if (isError) return <>에러..</>;

  return (
    <div style={{ width: "500px" }}>
      <Box alignContent={"center"}>
        <Grid container spacing={1} alignItems={"center"}>
          <Grid item xs={5}>
            <div>순번</div>
          </Grid>
          <Grid item xs={7}>
            <TextField variant="outlined" value={data?.id} disabled fullWidth />
          </Grid>
          <Grid item xs={5}>
            <div>이름</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              value={data?.name}
              disabled={isUpdate ? false : true}
              fullWidth
              onChange={(e) => onChange("name", e.target.value)}
            />
          </Grid>

          <Grid item xs={5}>
            <div>이메일</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              value={data?.email}
              disabled={isUpdate ? false : true}
              fullWidth
              onChange={(e) => onChange("email", e.target.value)}
            />
          </Grid>

          <Grid item xs={5}>
            <div>비밀번호</div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              value={data?.password}
              disabled={isUpdate ? false : true}
              fullWidth
              onChange={(e) => onChange("password", e.target.value)}
            />
          </Grid>
        </Grid>
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 8 }}
            onClick={() => {
              isUpdate ? fetchUserUpdate(userInfo) : setIsUpdate(true);
            }}
          >
            {isUpdate ? "저장" : "수정"}
          </Button>
          {!isUpdate ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                router.push("/attendancy/list");
              }}
              style={{ marginRight: 8 }}
            >
              목록
            </Button>
          ) : null}

          <Button
            variant="contained"
            color="error"
            onClick={() => {
              alert("삭제되었습니다.");
              fetchUserDelete(data?.id);
              router.push("/attendancy/list");
            }}
          >
            삭제
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default index;
