import { type ZodErrorMap, z } from "zod";

// Error map

type Error = Parameters<ZodErrorMap>["0"];
type Ctx = Parameters<ZodErrorMap>["1"];
type Field = string | number | undefined;

export class ZodCustomErrorMap {
  public errorMap(error: Error, ctx: Ctx) {
    const { code, path } = error;

    const currentField = path.at(-1);

    const filteredPath = error.path.filter((field) => field === currentField);
    const hasToIgnoreField = filteredPath.length > 1;

    if (hasToIgnoreField) {
      return { message: ctx.defaultError };
    }

    switch (code) {
      case z.ZodIssueCode.invalid_type:
        return this.handleInvalidTypeError(error, ctx, currentField);

      case z.ZodIssueCode.too_small:
        return this.handleTooSmallError(error, ctx, currentField);

      case z.ZodIssueCode.too_big:
        return this.handleTooBigError(error, ctx, currentField);

      case z.ZodIssueCode.invalid_string:
        return this.handleInvalidStringError(error, ctx, currentField);

      default:
        return { message: ctx.defaultError };
    }
  }

  private handleInvalidTypeError(
    error: z.ZodInvalidTypeIssue,
    ctx: Ctx,
    field: Field
  ) {
    const { received, expected } = error;

    if (received === "undefined") {
      return { message: `The field [${field}] is required` };
    }

    switch (expected) {
      case "string":
        return { message: `The field [${field}] must be a string` };

      case "number":
        return { message: `The field [${field}] must be a number` };
    }

    return { message: ctx.defaultError };
  }

  private handleTooSmallError(
    error: z.ZodTooSmallIssue,
    ctx: Ctx,
    field: Field
  ) {
    const { type, minimum } = error;

    switch (type) {
      case "string":
        if (error.exact) {
          return {
            message: `The field [${field}] must contain ${minimum} characters`,
          };
        }
        return {
          message: `The field [${field}] must contain at least ${minimum} characters`,
        };
      case "number":
        if (error.exact) {
          return {
            message: `The field [${field}] must be equal to ${minimum}`,
          };
        }
        return {
          message: `The field [${field}] must be greater than or equal to ${minimum}`,
        };
    }

    return { message: ctx.defaultError };
  }

  private handleTooBigError(error: z.ZodTooBigIssue, ctx: Ctx, field: Field) {
    const { type, maximum } = error;

    switch (type) {
      case "string":
        if (error.exact) {
          return {
            message: `The field [${field}] must contain ${maximum} characters`,
          };
        }
        return {
          message: `The field [${field}] must contain at most ${maximum} characters`,
        };
      case "number":
        if (error.exact) {
          return {
            message: `The field [${field}] must be equal to ${maximum}`,
          };
        }
        return {
          message: `The field [${field}] must be less than or equal to ${maximum}`,
        };
    }

    return { message: ctx.defaultError };
  }

  private handleInvalidStringError(
    error: z.ZodInvalidStringIssue,
    ctx: Ctx,
    field: Field
  ) {
    const { validation } = error;
    switch (validation) {
      case "email":
        return {
          message: `The field [${field}] must be a valid email`,
        };
      case "uuid":
        return {
          message: `The field [${field}] must be a valid uuid`,
        };
    }

    return { message: ctx.defaultError };
  }
}
