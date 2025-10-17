import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    console.log("🧩 DELETE /api/users/me called");

    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.email) {
      console.error("❌ No valid session found");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.error("❌ User not found in DB");
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Optional: prevent deleting admins
    if (user.role === "admin") {
      return new Response(JSON.stringify({ error: "Admins cannot delete their account" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Delete the user
    await prisma.user.delete({
      where: { email: user.email },
    });

    // Log the deletion (optional)
    await prisma.log.create({
      data: {
        action: `User ${user.email} deleted their account.`,
        userId: user.id,
      },
    });

    console.log(`✅ Deleted account: ${user.email}`);

    return new Response(JSON.stringify({ message: "Account deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("❌ Delete account error:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}
