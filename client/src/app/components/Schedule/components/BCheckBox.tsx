import React, { ChangeEvent } from "react";
import { Checkbox, FormControlLabel, SxProps, Theme } from "@mui/material";
import { ReactComponent as ImgCheckedSquare } from "@/public/images/icons/checkbox/checked-square.svg";
import { ReactComponent as ImgCheckedSquareLined } from "@/public/images/icons/checkbox/checked-square-lined.svg";
import { ReactComponent as ImgUnCheckedSquare } from "@/public/images/icons/checkbox/unchecked-square.svg";
import { ReactComponent as ImgCheckedCircle } from "@/public/images/icons/checkbox/checked-circle.svg";
import { ReactComponent as ImgUnCheckedCircle } from "@/public/images/icons/checkbox/unchecked-circle.svg";

interface IProps {
  text?: string | React.ReactNode;
  checked: boolean;
  disabled?: boolean;
  iconType: "square" | "square-lined" | "circle";
  isCheck: (ischeck: boolean) => void;
  sx?: SxProps<Theme>;
}

export default function BCheckBox({
  text,
  checked,
  disabled,
  iconType = "square",
  isCheck,
  sx,
}: IProps) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          icon={
            iconType === "square" || iconType === "square-lined" ? (
              <ImgUnCheckedSquare width={24} height={24} />
            ) : (
              <ImgUnCheckedCircle width={24} height={24} />
            )
          }
          checkedIcon={
            iconType === "square-lined" ? (
              <ImgCheckedSquareLined width={24} height={24} />
            ) : iconType === "square" ? (
              <ImgCheckedSquare width={24} height={24} />
            ) : (
              <ImgCheckedCircle width={24} height={24} />
            )
          }
          disabled={disabled}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            isCheck(e.target.checked);
          }}
        />
      }
      sx={{ fontSize: "14px", color: "#616161", marginRight: 0, ...sx }}
      label={text}
    />
  );
}
