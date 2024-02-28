import { Box, styled } from "@mui/material";
import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  isScrollSnap?: boolean; // 스크롤 스냅 여부
}

// 기본 레이아웃 : 헤더, 푸터, 로딩
export default function BasicLayout({
  children,
  isScrollSnap,
}: Props): React.ReactElement {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      id={"mainLayout"}
      ref={mainRef}
      sx={{
        height: "100vh",
        scrollBehavior: isScrollSnap ? "smooth" : "none",
        scrollSnapType: isScrollSnap ? "y mandatory" : "none",
        // overflowY: "scroll",

        // paddingTop: HEADER_HEIGHT,
      }}
    >
      <BoxSTContainer>
        {/*
            Breadcrumb는 추후 각 페이지 내에서 사용하도록 처리
           
            <Breadcrumb
            homeElement={"홈"}
            separator={<span style={{ margin: "0px 10px" }}>|</span>}
            containerStyle={{ justifyContent: "right" }}
          /> */}
        {/* <Container maxWidth={isTablet ? "md" : "lg"} disableGutters> */}
        {children}
        {/* </Container> */}
      </BoxSTContainer>
    </Box>
  );
}

const BoxSTContainer = styled(Box)(() => {
  return {
    minHeight: "100vh",
    // paddingTop: HEADER_HEIGHT,
  };
});
