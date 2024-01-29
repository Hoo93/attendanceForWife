"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  return (
    <Stack direction="row" spacing={2}>
      <Button onClick={() => router.push("/main")} variant="outlined">
        시작하기
      </Button>
    </Stack>
  );
};

export default Home;
