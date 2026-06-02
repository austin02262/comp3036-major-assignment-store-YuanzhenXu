import { PrismaClient } from "@prisma/client";
import { env } from "@repo/env/web";

declare global {
  // Reuse one PrismaClient during local hot reloads to avoid connection growth.
  var prisma: PrismaClient | undefined;
}

export const createClient = () => {
  if (global.prisma) {
    // Serverless invocations can reuse an existing warm client when available.
    return global.prisma;
  }

  const URL = env.DATABASE_URL;

  const prisma = new PrismaClient({
    datasourceUrl: URL,
  });

  console.log("Connected to database");

  global.prisma = prisma;
  return prisma;
};

export async function resetClient() {
  if (!global.prisma) return;

  // Used by retry logic after transient Neon/serverless connection failures.
  await global.prisma.$disconnect();
  global.prisma = undefined;
}

function isTransientDatabaseError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    message.includes("terminating connection due to administrator command") ||
    message.includes("Server has closed the connection") ||
    message.includes("Can't reach database server") ||
    message.includes("Connection terminated")
  );
}

export async function runWithDatabaseRetry<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    if (!isTransientDatabaseError(error)) {
      throw error;
    }

    // Neon can close idle pooled connections, so retry once with a fresh client.
    await resetClient();
    return operation();
  }
}

export const client = {
  get db() {
    // Lazy getter delays Prisma creation until a route actually touches the database.
    return createClient();
  },
};
