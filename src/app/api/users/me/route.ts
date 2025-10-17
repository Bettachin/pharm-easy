import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE() {
  try {
    // Get the logged-in user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Delete user
    await prisma.user.delete({
      where: { email: session.user.email },
    });

    // Log the deletion
    await prisma.log.create({
      data: {
        action: `User ${user.email} deleted their account.`,
        userId: user.id,
      },
    });

    return new Response("Account deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Delete account error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
