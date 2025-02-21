import { z } from "zod";

const createPinSchema = z.object({
  code: z
    .string({ required_error: "Code is required" })
    .min(2, { message: "Code must have at least 2 characters" }),
});

export class PinDTO {
  constructor(public readonly code: string) {}

  static create(object: { [key: string]: any }): [string?, PinDTO?] {
    const { code } = object;

    const result = createPinSchema.safeParse(object);

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((e) => e.message)
        .join(" --- ");
      return [errorMessages];
    }

    return [undefined, new PinDTO(code)];
  }
}
