import AddIcon from '@mui/icons-material/Add';
import Paper from "@mui/material/Paper";
// Libraries
import React from "react";
// Component
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";

interface Info {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface CommonTableProps {
  infoList: Info[];
  isCreate:boolean;
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
  // or void
}

const CommonTable: React.FC<CommonTableProps> = ({ infoList, isCreate, setIsCreate }) => {
  const router = useRouter();


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>이름</TableCell>
            <TableCell>출석 상태</TableCell>
            <TableCell>지각</TableCell>
            <TableCell>등원시간</TableCell>
            <TableCell>비고</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {infoList?.map((item: Info) => (
            <TableRow
              key={item.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              hover
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.push(`/attendancy/list/${item.id}`);
              }}
            >
              <TableCell  component="th" scope="row">
                {item.id}
              </TableCell>
              <TableCell  component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell >{item.email}</TableCell>
              <TableCell >{item.password}</TableCell>
              <TableCell >비고</TableCell>
            </TableRow>
          ))}
          <TableRow     
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}   
              style={{ cursor: "pointer" }}
          >
            {isCreate ? 
            <>
              <TableCell  component="th" scope="row">
                <TextField id="outlined-basic" label="이름" variant="outlined" />
              </TableCell>
                <TableCell  component="th" scope="row">
              <TextField id="outlined-basic" label="출석 상태" variant="outlined" />
                </TableCell>
              <TableCell  component="th" scope="row">
                <TextField id="outlined-basic" label="지각" variant="outlined" />
              </TableCell>
              <TableCell  component="th" scope="row">
                <TextField id="outlined-basic" label="등원시간" variant="outlined" />
              </TableCell>
              <TableCell  component="th" scope="row">
                <TextField id="outlined-basic" label="비고" variant="outlined" />
              </TableCell>
            </> 
           :     <TableCell component="th" style={{display:"flex", alignItems:"center", gap:"10px"}} onClick={() => setIsCreate(true)}>
           <AddIcon /> <p>생성</p>
         </TableCell>
          }
          
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommonTable;
