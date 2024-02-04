"use client";

// Component
import { Box, Button } from "@mui/material";

import CommonTable from "@/app/components/Table";
import axios from "axios";
// libraries
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const index = () => {
  const router = useRouter();
  // const { infoList, fetchInfoList } = useUser(); <- react query로 인한 주석

  const { isLoading, data, isError } = useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/api/users");
      return response?.data.result;
    },
  });

  if (isLoading) return <>Loading...</>;
  if (isError) return <>에러..</>;

  return (
    <div
      style={{
        width: "800px",
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "column",
      }}
    >
      <CommonTable infoList={data} />
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: 8 }}
          onClick={() => {
            router.push("/attendancy/create");
          }}
        >
          회원 생성
        </Button>
      </Box>
    </div>
  );
};

export default index;
