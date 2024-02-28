import { Box, Typography, styled } from "@mui/material";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BCheckBox from "./BCheckBox";

const WEEKDAY_TEXTS = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];

const LESSON_HOURS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export interface ScheduleCheckGroupProps {
  /** 요일 순번 (월요일부터 시작) */
  weekday: number;

  /** 시간별 가능여부 */
  hours: Record<string, boolean>;

  /** 시간별 가능여부 변경 */
  onChangeHours: (value: Record<string, boolean>) => void;
}

export default function ScheduleCheckGroup({
  weekday,
  hours,
  onChangeHours,
}: ScheduleCheckGroupProps) {
  const { t } = useTranslation();

  // 전체 체크 여부
  const all = useMemo(
    () => Object.values(hours).filter(Boolean).length === LESSON_HOURS.length,
    [hours]
  );

  // 전체 체크
  const checkAll = (value: boolean) => {
    const newHours: Record<string, boolean> = {};
    LESSON_HOURS.forEach((lessonHour) => {
      newHours[lessonHour] = value;
    });
    onChangeHours(newHours);
  };

  // 배열에 value false 경우 delete
  const onChangeChecks = (hour: string, newChecked: boolean) => {
    const newHours: Record<string, boolean> = { ...hours };
    if (!newChecked) {
      delete newHours[hour];
    } else {
      newHours[hour] = newChecked;
    }
    onChangeHours(newHours);
  };

  return (
    <BoxST>
      <BoxSTgrid>
        <WeekdayTitleST>{t(WEEKDAY_TEXTS[weekday])}</WeekdayTitleST>
        <BCheckBox
          checked={all}
          iconType="square-lined"
          isCheck={checkAll}
          text={
            <TypograpySTchecboxText active={all}>전체</TypograpySTchecboxText>
          }
        />
      </BoxSTgrid>
      <BoxSTgrid>
        {LESSON_HOURS.map((hour) => {
          return (
            <Box key={hour} sx={{ flexGrow: 0, flexShrink: 1 }}>
              <BCheckBox
                checked={hours[hour] || false}
                iconType="square"
                isCheck={(newChecked: boolean) =>
                  onChangeChecks(hour, newChecked)
                }
                text={<TypograpySTchecboxText>{hour}</TypograpySTchecboxText>}
              />
            </Box>
          );
        })}
      </BoxSTgrid>
    </BoxST>
  );
}

const BoxST = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };
});

const WeekdayTitleST = styled(Typography)(({ theme }) => {
  return {
    fontSize: "20px",
    fontWeight: "700",
    [theme.breakpoints.up("sm")]: {
      fontSize: "24px",
    },
    [theme.breakpoints.up("md")]: {
      marginBottom: "8px",
      textAlign: "center",
    },
  };
});

const BoxSTgrid = styled(Box)(({ theme }) => {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "4px",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "1fr",
    },
  };
});

const TypograpySTchecboxText = styled(Typography)<{ active?: boolean }>(
  ({ active, theme }) => {
    return {
      fontSize: "14px",
      color: active ? theme.palette.primary.main : "initial",
      fontWeight: active ? "700" : "400",
      [theme.breakpoints.up("md")]: {
        fontSize: "16px",
      },
    };
  }
);
