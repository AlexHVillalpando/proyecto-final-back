import { z } from "zod";
import { regularExp } from "../../../config/regular-exp";

const loginUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(4, { message: "Email must have at least 4 characters" })
    .regex(regularExp.email, { message: "Invalid email format" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must have at least 8 characters" })
    .regex(regularExp.password, {
      message:
        "Password must contain at least one special character, one capital letter and a number",
    }),
});

export class LoginUserDTO {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(object: { [key: string]: any }): [string?, LoginUserDTO?] {
    
    const result = loginUserSchema.safeParse(object);
    
    if (!result.success) {
      const errorMessages = result.error.issues
      .map((e) => e.message)
      .join(" --- ");
      return [errorMessages];
    }
    
    const { email, password } = result.data;
    return [undefined, new LoginUserDTO(email, password)];
  }
}
