import { encriptAdapter } from "../../config/bcrypt.adapter";
import { decryptData } from "../../config/crypto.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { Status } from "../../config/regular-exp";
import { Pin, User } from "../../data";
import {
  CustomError,
  LoginUserDTO,
  PinDTO,
  RegisterUserDTO,
} from "../../domain";
import { PinService } from "./pin.service";

export class UserService {
  constructor(public readonly pinService: PinService) {}

  async getUsers(user: User) {
    try {
      return await User.find({
        where: {
          id: user.id,
        },
        relations: [
          "security_boxes",
          "security_boxes.credentialsStorage",
          "security_boxes.credentialsStorage.pin",
        ],
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          cellphone: true,
          status: true,
          security_boxes: {
            id: true,
            name: true,
            favorite: true,
            icon: true,
            status: true,
            credentialsStorage: {
              account: true,
              description: true,
              code_1: true,
              code_2: true,
              pin: {
                id: true,
                code: true,
              },
            },
          },
        },
      });
    } catch (error) {
      throw CustomError.internalServer("Error getting the user");
    }
  }

  async getOneUser(id: string) {
    const user = await User.findOne({
      where: {
        id,
        status: Status.ACTIVE,
      },
      relations: [
        "security_boxes",
        "security_boxes.credentialsStorage",
        "security_boxes.credentialsStorage.pin",
      ],
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        cellphone: true,
        status: true,
        security_boxes: {
          id: true,
          name: true,
          favorite: true,
          icon: true,
          status: true,
          credentialsStorage: {
            account: true,
            description: true,
            code_1: true,
            code_2: true,
            pin: {
              id: true,
              code: true,
            },
          },
        },
      },
    });
    if (!user) {
      throw CustomError.notFound("User not found");
    }
    return user;
  }

  async register(userData: RegisterUserDTO) {
    const user = new User();

    user.name = userData.name;
    user.surname = userData.surname;
    user.email = userData.email;
    user.cellphone = userData.cellphone;
    user.password = userData.password;

    const pinData: PinDTO = { code: userData.code };

    const pin = await this.pinService.createPin(pinData, user.id);
    user.pin = pin;

    user.pinId = pin.id;

    try {
      const dbUser = await user.save();

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        cellphone: dbUser.cellphone,
        status: dbUser.status,
        pin: {
          id: pin.id,
          code: decryptData(pin.code),
        },
      };
    } catch (error: any) {
      if (error.code === "23505") {
        throw CustomError.badRequest(
          `User with ${userData.email} already exist`
        );
      }
      throw CustomError.internalServer("Error creating user");
    }
  }

  async login(credentials: LoginUserDTO) {
    const user = await this.findUserByEmail(credentials.email);

    const isMatching = encriptAdapter.compare(
      credentials.password,
      user.password
    );

    if (!isMatching) throw CustomError.unAuthorized("Invalid Credentials");

    const token = await JwtAdapter.generateToken({ id: user.id });

    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async updateUser(id: string, userData: any) {
    const user = await this.getOneUser(id);

    user.name = userData.name.toLowerCase().trim();
    user.surname = userData.surname.toLowerCase().trim();
    user.email = userData.email.toLowerCase().trim();
    user.cellphone = userData.cellphone.toLowerCase().trim();

    try {
      return await user.save();
    } catch (error: any) {
      console.log(error);
      if (error.code === "23505") {
        throw CustomError.badRequest(
          `User with ${userData.email} already exist`
        );
      }
      throw CustomError.internalServer("Error updating user");
    }
  }

  async deleteUser(id: string) {
    const user = await this.getOneUser(id);

    user.status = Status.DELETED;

    try {
      return await user.save();
    } catch (error) {
      throw CustomError.internalServer("Error deleting post");
    }
  }

  async findUserByEmail(email: string) {
    const user = await User.findOne({
      where: {
        email,
        status: Status.ACTIVE,
      },
    });

    if (!user)
      throw CustomError.notFound(`User with email: ${email} not found`);

    return user;
  }
}
