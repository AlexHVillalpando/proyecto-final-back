import { z } from "zod";

const registerUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must have at least 3 characters" }),
  userId: z.string({ message: "UUID is required" }).uuid({
    message: "Invalid UUID format",
  }),
});

export class CreateSecurityBoxDTO {
  constructor(
    public readonly name: string,
    public readonly favorite: boolean,
    public readonly icon: string,
    public readonly userId: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateSecurityBoxDTO?] {
    const { name, favorite, icon, userId } = object;

    const result = registerUserSchema.safeParse(object);

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((e) => e.message)
        .join(" --- ");
      return [errorMessages];
    }

    return [undefined, new CreateSecurityBoxDTO(name, favorite, icon, userId)];
  }
}
