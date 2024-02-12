"use client";

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Hidden,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import BasicLayout from "@/app/components/BasicLayout";
import CommonTable from "@/app/components/Table";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Index = () => {
  const router = useRouter();
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
        <CommonTable
          infoList={data}
          setIsCreate={setIsCreate}
          isCreate={isCreate}
        />

        {isCreate && (
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
