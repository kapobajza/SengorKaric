import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

import { generateCommonDbTableFields } from "./util";

export const users = pgTable("users", {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  avatar: varchar({ length: 255 }),
  ...generateCommonDbTableFields(),
});
