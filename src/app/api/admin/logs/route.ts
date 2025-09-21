import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const logs = await prisma.log.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify(logs));
}
