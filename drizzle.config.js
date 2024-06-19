/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://interview-ai_owner:vcB5CK1WNRrO@ep-blue-dust-a54hrycn.us-east-2.aws.neon.tech/interview-ai?sslmode=require",
  },
};
