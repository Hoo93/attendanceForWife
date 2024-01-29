import { useState } from "react";

export interface Info {
  id: number;
  name: string;
  email: string;
  password: string;
}
export interface CreateInfo {
  name: string;
  email: string;
  password: string;
}

export default function useUser() {
  const [infoList, setInfoList] = useState<Info[]>([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<Info>({
    id: 0,
    name: "",
    email: "",
    password: "",
  });

  const fetchInfoList = async () => {
    const response = await fetch("/api/users", {
      method: "GET",
    });

    const data = await response.json();
    setInfoList(data.result);
  };

  const fetchUserCraete = async (params: CreateInfo) => {
    const { name, email, password } = params;
    await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
  };

  const fetchUserDetail = async (id: number) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    setUserInfo(data.result);
  };

  const fetchUserUpdate = async (params: Info) => {
    const { id, name, email, password } = params;

    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, email, password }),
    });
    const data = await response.json();
    if (data.result) {
      alert("저장되었습니다.");
      setIsUpdate(false);
      fetchUserDetail(id);
    }
  };

  const fetchUserDelete = async (id: number) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    console.log(data);
  };

  return {
    fetchInfoList,
    fetchUserCraete,
    fetchUserUpdate,
    fetchUserDetail,
    fetchUserDelete,
    infoList,
    isUpdate,
    userInfo,
    setUserInfo,
    setIsUpdate,
  };
}
