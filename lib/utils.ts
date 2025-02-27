import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { ZodError, ZodSchema } from "zod";
import { ZodCustomErrorMap } from "./zodErrorMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateWithZod = <T>(schema: ZodSchema<T>, data: unknown) => {
  try {
    const customErrorMap = new ZodCustomErrorMap();
    const parsedData = schema.parse(data, {
      errorMap: (error, ctx) => customErrorMap.errorMap(error, ctx),
    });
    return parsedData;
  } catch (error: unknown) {
    const message =
      (error as ZodError).issues.map((issue) => issue.message).join(". ") + ".";
    return NextResponse.json({ message }, { status: 400 });
  }
};
