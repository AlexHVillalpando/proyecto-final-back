import { z } from "zod";
import { regularExp } from "../../../config/regular-exp";

const registerUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must have at least 3 characters" }),
  surname: z
    .string({ required_error: "Last name is required" })
    .min(3, { message: "Last name must have at least 3 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .min(4, { message: "Email must have at least 4 characters" })
    .regex(regularExp.email, { message: "Invalid email format" }),
  cellphone: z
    .string({ required_error: "Cellphone is required" })
    .min(6, { message: "Cellphone must have at least 6 digits" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must have at least 8 characters" })
    .regex(regularExp.password, {
      message: "Password must contain at least one special character",
    }),
  code: z
    .string({ required_error: "Code is required" })
    .min(3, { message: "Code must have at least 3 characters" }),
});

export class RegisterUserDTO {
  constructor(
    public readonly name: string,
    public readonly surname: string,
    public readonly email: string,
    public readonly cellphone: string,
    public readonly password: string,
    public readonly code: string
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDTO?] {
    const result = registerUserSchema.safeParse(object);

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((e) => e.message)
        .join(" --- ");
      return [errorMessages];
    }

    const { name, surname, email, cellphone, password, code } =
      result.data;
    return [
      undefined,
      new RegisterUserDTO(
        name,
        surname,
        email,
        cellphone,
        password,
        code
      ),
    ];
  }
}
