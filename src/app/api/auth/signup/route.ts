import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response("Missing fields", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user", // default role
      },
    });

    // ✅ Step 5: record the signup in logs
    await prisma.log.create({
      data: {
        action: `User signed up`,
        userId: user.id,
      },
    });

    return new Response(JSON.stringify({ id: user.id, email: user.email }), {
      status: 201,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}