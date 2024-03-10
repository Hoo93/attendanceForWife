"use client";
import Link from "next/link";
// pages/404.js
// import { makeStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import { Box, Button, Typography, styled } from "@mui/material";

const MyThemeComponent = styled(Box)(({ theme }) =>
  theme.unstable_sx({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
    gap: "20px",
    backgroundColor: "#212121", // 검은색 계열 배경색
    color: "#ffffff", // 텍스트 색상
  })
);

export default function Custom404() {
  return (
    <MyThemeComponent>
      <Typography variant="h3">404 - 페이지를 찾을 수 없습니다.</Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">
          메인으로 돌아가기
        </Button>
      </Link>
    </MyThemeComponent>
  );
}
