import { Request, Response } from "express";
import { CredentialStorageService } from "../services/credential_storage.service";
import { CreateCredentialStorageDTO, CustomError, UpdateCredentialStorageDTO } from "../../domain";

export class CredentialStorageController {
  constructor(
    private readonly credentialService: CredentialStorageService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: "Something went very wrong" });
  };

  createCredential = async (req: Request, res: Response) => {
    const [error, createCredentialDTO] = CreateCredentialStorageDTO.create(
      req.body
    );

    if (error) return res.status(422).json({ message: error });

    const id = req.body.sessionBody.id
    console.log("id: ", id);

    this.credentialService
      .createCredentialStorage(createCredentialDTO!, id)
      .then((data) => {
        return res.status(201).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };

  getAllCredentials = async (req: Request, res: Response) => {
    this.credentialService
      .getCredentialStorage()
      .then((data) => {
        return res.status(201).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };

  getOneCredential = async (req: Request, res: Response) => {
    const { id } = req.params;
    this.credentialService
      .getOneCredentialStorage(id)
      .then((data: any) => {
        res.status(200).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };

  editCredential = async (req: Request, res: Response) => {
    const { id } = req.params;

    const [error, updateCredentialDTO] = UpdateCredentialStorageDTO.update(
      req.body
    );

    if (error) return res.status(422).json({ message: error });

    this.credentialService
      .updateCredentialStorage(id, updateCredentialDTO!)
      .then((data: any) => {
        return res.status(200).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };

  deleteCredential = async (req: Request, res: Response) => {
    const { id } = req.params;

    this.credentialService
      .deleteCredentialStorage(id)
      .then((data: any) => {
        return res.status(204).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };
}
