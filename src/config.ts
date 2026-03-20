import { z } from "zod";

const configSchema = z.object({
  APOLLO_API_KEY: z.string().min(1, "APOLLO_API_KEY is required"),
  PORT: z.coerce.number().int().default(3000),
  APOLLO_BASE_URL: z.string().url().default("https://api.apollo.io/api"),
});

export type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Invalid configuration:", result.error.format());
    process.exit(1);
  }
  return result.data;
}

export const config = loadConfig();
