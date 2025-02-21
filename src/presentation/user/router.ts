import { Router } from "express";
import { UserService } from "../services/user.service";
import { UserController } from "./controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { PinService } from "../services/pin.service";

export class UserRouter {
    static routes(): Router {
      const router = Router();
  
      const pinService = new PinService()
      const userService = new UserService(pinService);
      const userController = new UserController(userService);
  
      router.post("/", userController.register);
      router.post("/login", userController.login);

      router.use(AuthMiddleware.protect);
      
      router.get("/:id", userController.getOneUser);
      router.get("/", userController.getAllUser);
      router.patch("/:id", userController.editUser);
      router.delete("/:id", userController.deleteUser);
  
      return router;
    }
  }
  
