import { z } from "zod";
import { regularExp } from "../../../config/regular-exp";
import { publicDecrypt } from "crypto";

const registerUserSchema = z.object({
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
  securityId: z.string({ message: "UUID is required" }).uuid({
    message: "Invalid UUID format",
  }),
});

export class CreateCredentialStorageDTO {
  constructor(
    public readonly account: string,
    public readonly password: string,
    public readonly description: string,
    public readonly code_1: string,
    public readonly code_2: string,
    public readonly securityId: string,
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string?, CreateCredentialStorageDTO?] {
    const { account, password, description, code_1, code_2, securityId } = object;

    const result = registerUserSchema.safeParse(object);

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((e) => e.message)
        .join(" --- ");
      return [errorMessages];
    }

    return [
      undefined,
      new CreateCredentialStorageDTO(
        account,
        password,
        description,
        code_1,
        code_2,
        securityId,
      ),
    ];
  }
}
