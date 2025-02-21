import { Router } from "express";
import { UserRouter } from "./user/router";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { SecurityRouter } from "./security_box/router";
import { CredentialRouter } from "./credential_storage/router";
import { PinRouter } from "./pin/router";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/users", UserRouter.routes());  

    router.use(AuthMiddleware.protect);
    router.use("/api/security", SecurityRouter.routes());
    router.use("/api/credential", CredentialRouter.routes());
    router.use("/api/pin", PinRouter.routes());

    return router;
  }
}