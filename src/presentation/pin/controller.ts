import { Request, Response } from "express";
import { CustomError, PinDTO } from "../../domain";
import { PinService } from "../services/pin.service";

export class PinController {
  constructor(private readonly pinService: PinService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: "Something went very wrong" });
  };

  createPin = async (req: Request, res: Response) => {
    const [error, pinDTO] = PinDTO.create(req.body);

    const userId = req.body.sessionBody.id

    if (error) return res.status(422).json({ message: error });

    this.pinService
      .createPin(pinDTO!, userId)
      .then((data) => {
        return res.status(201).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };

  getAllPin = async (req: Request, res: Response) => {
    this.pinService
      .getPin()
      .then((data) => {
        return res.status(201).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };

  getOnePin = async (req: Request, res: Response) => {
    const { id } = req.params;
    this.pinService
      .getOnePin(id)
      .then((data: any) => {
        res.status(200).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };

  editpin = async (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, pinDTO] = PinDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.pinService
      .updatePin(id, pinDTO!)
      .then((data: any) => {
        return res.status(200).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };
}
