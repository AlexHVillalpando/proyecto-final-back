import { Router } from "express";
import { PinService } from "../services/pin.service";
import { PinController } from "./controller";


export class PinRouter {
  static routes(): Router {
    const router = Router();

    const pinService = new PinService()
    const pinController = new PinController(pinService)

    router.get("/:id", pinController.getOnePin);
    router.get("/", pinController.getAllPin);
    router.post("/", pinController.createPin);
    router.patch("/:id", pinController.editpin);

    return router;
  }
}