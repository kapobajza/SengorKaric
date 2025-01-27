import { timestamp } from "drizzle-orm/pg-core";

export function generateCommonDbTableFields() {
  return {
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  };
}
