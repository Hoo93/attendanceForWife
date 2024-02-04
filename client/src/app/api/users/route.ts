import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../prisma/generated/client";

const prisma = new PrismaClient();

export async function GET() {
  const allUsers = await prisma.user.findMany({});

  return NextResponse.json({ result: allUsers });
}

// Handles POST requests to /api
export async function POST(request: any) {
  try {
    const { name, email, password } = await request.json();
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    return NextResponse.json({ message: "생성되었습니다." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: error });
  }
}
export async function DELETE(request: any) {
  try {
    const userId = request.query.id;
    // const { id } = await request.json();

    const deletedUser = await prisma.user.delete({
      where: { id: Number(userId) },
    });

    return NextResponse.json({ message: "삭제되었습니다." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: error });
  }
}
