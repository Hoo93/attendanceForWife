"use client";

// Libraries
import * as React from "react";

import BasicLayout from "@/app/components/BasicLayout";
// Mui
import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";

const index = () => {
  const router = useRouter();

  return (
    <BasicLayout>
      <Stack gap={"20px"} padding={"30px"} minWidth={"300px"}>
        <Button onClick={() => {}} variant="contained">
          출석이 설정
        </Button>
        <Button
          onClick={() => router.push("/attendancy/dashboard")}
          variant="outlined"
        >
          출석이 대시보드
        </Button>
        <Button
          onClick={() => router.push("/attendancy/dashboard")}
          variant="outlined"
        >
          출석이 명단관리
        </Button>
        <Button
          onClick={() => router.push("/attendancy/list")}
          variant="outlined"
        >
          출석이 출석부
        </Button>
        <Button
          onClick={() => alert("준비중인 기능입니다.")}
          variant="outlined"
        >
          기타 등등
        </Button>
      </Stack>
    </BasicLayout>
  );
};

export default index;
