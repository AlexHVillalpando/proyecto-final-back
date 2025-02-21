import { Router } from "express";
import { SecurityService } from "../services/security_controller.service";
import { SecurityBoxController } from "./controller";
import { UserService } from "../services/user.service";
import { PinService } from "../services/pin.service";

export class SecurityRouter {
  static routes(): Router {
    const router = Router();

    const pinService = new PinService()
    const userService = new UserService(pinService);
    const securityService = new SecurityService(userService);
    const securityController = new SecurityBoxController(securityService);

    router.get("/:id", securityController.getOneSecurity);
    router.get("/", securityController.getAllSecurityBox);
    router.post("/", securityController.createSecurityBox);
    router.patch("/:id", securityController.editSecurity);
    router.delete("/:id", securityController.deleteSecurity);

    return router;
  }
}
