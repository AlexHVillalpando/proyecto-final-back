import { z } from "zod";
import { regularExp } from "../../../config/regular-exp";

const updateUserSchema = z.object({
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
});

export class UpdateUserDTO {
  constructor(
    public readonly name: string,
    public readonly surname: string,
    public readonly email: string,
    public readonly cellphone: string
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateUserDTO?] {
    const result = updateUserSchema.safeParse(object);

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((e) => e.message)
        .join(" --- ");
      return [errorMessages];  
    }

    const { name, surname, email, cellphone } = result.data;
    return [undefined, new UpdateUserDTO(name, surname, email, cellphone)];
  }
}
