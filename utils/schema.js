import { pgTable, text, serial, varchar } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mock_interviews", {
  id: serial("id").primaryKey(),
  jsonMockResponse: text("jsonMockResponse").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDiscription: varchar("jobDiscription").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"),
  mockInterviewId: varchar("mockInterviewId").notNull(),
});
