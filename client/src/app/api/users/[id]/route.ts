import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../prisma/generated/client";

const prisma = new PrismaClient();
export async function GET(request: any) {
  const url = new URL(request.url);

  // URL에서 path 부분을 가져옵니다.
  const path = url.pathname;

  // 정규식을 사용하여 path에서 숫자 부분을 추출합니다.
  const match = path.match(/\/(\d+)$/);

  // 추출된 숫자를 확인하고 사용합니다.
  if (match) {
    const id = parseInt(match[1], 10);

    const findUsers = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    return NextResponse.json({ result: findUsers });
  } else {
    console.error("No number found in the URL path");
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
}

export async function PUT(request: any) {
  const { id, name, email, password } = await request.json();

  const UpdateUser = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name: name,
      email: email,
      password: password,
    },
  });

  return NextResponse.json({ result: true });
}

export async function DELETE(request: any) {
  const { id } = await request.json();

  const findUsers = await prisma.user.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ result: findUsers });
}
