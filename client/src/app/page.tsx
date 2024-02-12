"use client";

import * as React from "react";

import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";

const index = () => {
  const router = useRouter();

  return (
    <Stack direction="row" spacing={2}>
      <Button onClick={() => router.push("/attendancy/list")} variant="outlined">
        출석이 시작하기
      </Button>
    </Stack>
  );
};

export default index;
