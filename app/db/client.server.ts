import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schemas";

export const getDrizzle = (binding: D1Database) => {
  return drizzle(binding, {
    schema,
  });
};

export const getDB = (args: LoaderFunctionArgs) => {
  return getDrizzle(args.context.cloudflare.env.DB);
};
