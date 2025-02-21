import { z } from "zod";
import { regularExp } from "../../../config/regular-exp";

const registerCredentialSchema = z.object({
  account: z
    .string({ required_error: "Account is required" })
    .min(3, { message: "Account must have at least 3 characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must have at least 8 characters" })
    .regex(regularExp.password, {
      message: "Password must contain at least one special character",
    }),
  description: z
    .string({ required_error: "Description is required" })
    .min(10, { message: "Description must have at least 10 characters" }),
  code_1: z
    .string({ required_error: "Account is required" })
    .min(3, { message: "Account must have at least 3 characters" }),
  code_2: z
    .string({ required_error: "Account is required" })
    .min(3, { message: "Account must have at least 3 characters" }),
});

export class UpdateCredentialStorageDTO {
  constructor(
    public readonly account: string,
    public readonly password: string,
    public readonly description: string,
    public readonly code_1: string,
    public readonly code_2: string,
  ) {}

  static update(object: {
    [key: string]: any;
  }): [string?, UpdateCredentialStorageDTO?] {
    const { account, password, description, code_1, code_2 } = object;

    const result = registerCredentialSchema.safeParse(object);

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((e) => e.message)
        .join(" --- ");
      return [errorMessages];
    }

    return [
      undefined,
      new UpdateCredentialStorageDTO(
        account,
        password,
        description,
        code_1,
        code_2,
      ),
    ];
  }
}
