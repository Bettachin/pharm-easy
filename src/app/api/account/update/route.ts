import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const data = await req.json();
    const { name, email, password } = data;

    // Build update object
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const bcrypt = await import("bcrypt");
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
    });

    // Add log
    await prisma.log.create({
      data: {
        action: `Updated account (${session.user.email})`,
        userId: updatedUser.id,
      },
    });

    return Response.json({ message: "Account updated successfully" });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}
