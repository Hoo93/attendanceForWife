import {
  Box,
  Button,
  Container,
  Divider,
  Typography,
  styled,
} from "@mui/material";
import { Fragment, useState } from "react";

import ScheduleCheckGroup from "./components/ScheduleCheckGroup";
import dayjs from "dayjs";

import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";
const INITIAL_SCHEDULES: Record<string, boolean>[] = [
  {},
  {},
  {},
  {},
  {},
  {},
  {},
];

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0];

export default function ClassScheduleContainer() {
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
  const [schedulesFix, setSchedulesFix] = useState(INITIAL_SCHEDULES);

  const applyDate = dayjs().add(1, "day").format(t("YYYY년 MM월 DD일")); // TODO: 서버에서 가져오기
  // 일정 서버 데이터로 되돌리기
  const reset = () => {
    toast.warn("기존에 선택된 일정대로 초기화 되었습니다.");
  };
  const save = () => {};
  const isEqual = schedules.every((obj, index) => {
    const keysSchedules = Object.keys(obj);
    const keysSchedulesFix = Object.keys(schedulesFix[index]);
    if (keysSchedules.length !== keysSchedulesFix.length) {
      return false;
    }
    return keysSchedules.every((key) => obj[key] === schedulesFix[index][key]);
  });

  return (
    <BoxSTwrapper>
      <ContainerST>
        <BoxSTplannerWrapper>
          <BoxSTapplyDate>
            <TypographSTapplyDate>{t("적용일")}</TypographSTapplyDate>
            <TypographSTapplyDate>{applyDate}</TypographSTapplyDate>
          </BoxSTapplyDate>
          <BoxSTschedulerGrid>
            {WEEKDAYS.map((weekday) => (
              <Fragment key={weekday}>
                <ScheduleCheckGroup
                  weekday={weekday}
                  hours={schedules[weekday]}
                  onChangeHours={(newHours) => {
                    setSchedules(
                      schedules.map((h, i) => (i === weekday ? newHours : h))
                    );
                  }}
                />
                <Divider />
              </Fragment>
            ))}
          </BoxSTschedulerGrid>
          <BoxSTnotice component="ul">
            <li>{t("공휴일은 자동으로 수업 일정에서 제거됩니다.")}</li>
            <li>
              {t(
                "일정 변경은 매달 1번만 가능하며, 상단에 표시된 적용 기간까지 반영됩니다. (*분기 단위로 자동 갱신)"
              )}
            </li>
            <li>
              {t("완료했거나 예정된 수업일정은 수업현황 메뉴에서 확인하세요.")}
            </li>
          </BoxSTnotice>
          <BoxSTbuttonGroup>
            <ButtonST variant="outlined" onClick={reset}>
              취소
            </ButtonST>
            <ButtonST variant="contained" onClick={save} disabled={isEqual}>
              확인
            </ButtonST>
          </BoxSTbuttonGroup>
        </BoxSTplannerWrapper>
      </ContainerST>
    </BoxSTwrapper>
  );
}
const BoxSTwrapper = styled(Box)(({ theme }) => {
  return {
    minHeight: "100vh",
    background: theme.palette.grey[50],
    [theme.breakpoints.up("sm")]: {
      fontFamily: "NanumSquareRound",
    },
  };
});
const ContainerST = styled(Container)(({ theme }) => {
  return {
    paddingBottom: "40px",
    [theme.breakpoints.up("md")]: {
      paddingBottom: "80px",
    },
  };
});
const BoxSTplannerWrapper = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    borderRadius: "32px",
    padding: "48px 24px",
    backgroundColor: "white",
    border: `2px solid ${theme.palette.grey[200]}`,
    [theme.breakpoints.up("md")]: {
      padding: "64px 48px",
      gap: "40px",
    },
  };
});
const BoxSTapplyDate = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    borderRadius: "16px",
    border: `2px solid ${theme.palette.grey[200]}`,
    backgroundColor: theme.palette.grey[50],
    gap: "4px",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      gap: "24px",
    },
  };
});
const TypographSTapplyDate = styled(Typography)(({ theme }) => {
  return {
    fontFamily: "NanumSquareRound",
    fontSize: "14px",
    fontWeight: "700",
    [theme.breakpoints.up("md")]: {
      fontSize: "16px",
    },
  };
});
const BoxSTschedulerGrid = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "24px",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      gap: "4px",
    },
  };
});
const BoxSTnotice = styled(Box)(({ theme }) => {
  return {
    padding: "16px",
    borderRadius: "16px",
    backgroundColor: theme.palette.grey[50],
    fontSize: "14px",
    [theme.breakpoints.up("md")]: {
      padding: "24px",
      fontSize: "16px",
    },
    li: {
      position: "relative",
      paddingLeft: "10px",
      listStyle: "none",
    },
    "li:before": {
      position: "absolute",
      left: 0,
      top: 0,
      content: `"-"`,
    },
  };
});
const BoxSTbuttonGroup = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    alignItems: "center",
    justifyContent: "center",
  };
});
const ButtonST = styled(Button)(({ theme }) => {
  return {
    flexGrow: "0",
    flexShrink: "1",
    width: "180px",
  };
});
