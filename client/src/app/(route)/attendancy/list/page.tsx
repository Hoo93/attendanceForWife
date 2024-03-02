"use client";

import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";

import BasicLayout from "@/app/components/BasicLayout";
import CommonTable from "@/app/components/Table";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/app/utils";

const Index = () => {
  const accessToken = Cookies.get("access-token");
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { isLoading, data, isError } = useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/attendances`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
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
        <CommonTable
          infoList={data}
          setIsCreate={setIsCreate}
          isCreate={isCreate}
        />
      </Box>
    </BasicLayout>
  );
};

export default Index;
