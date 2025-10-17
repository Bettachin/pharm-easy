import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE() {
  console.log("🧩 DELETE /api/users/me called");

  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // 🧹 Delete all logs associated with the user first
    await prisma.log.deleteMany({
      where: { userId: user.id },
    });

    // 🗑️ Now delete the user
    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log(`✅ Deleted user: ${user.email}`);
    return new Response("Account deleted successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Delete account error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
