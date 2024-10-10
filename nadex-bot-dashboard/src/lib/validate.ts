/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";

type ValidationPair = [any, z.ZodSchema<any>];

export const validateInputs = (...pairs: ValidationPair[]): void => {
  for (const [value, schema] of pairs) {
    const inputValidation = schema.safeParse(value);

    if (!inputValidation.success) {
      console.error(
        `Validation failed for ${JSON.stringify(value).substring(0, 100)} and ${JSON.stringify(schema)}: ${inputValidation.error.message}`
      );
      throw new Error("Validation failed");
    }
  }
};
