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
        <Button onClick={() => router.push("/attendancy/")} variant="outlined">
          설정1
        </Button>
        <Button onClick={() => router.push("/attendancy/")} variant="outlined">
          설정2
        </Button>
        <Button onClick={() => router.push("/attendancy/")} variant="outlined">
          설정3
        </Button>
        <Button onClick={() => router.push("/attendancy/")} variant="outlined">
          설정4
        </Button>
      </Stack>
    </BasicLayout>
  );
};

export default index;
