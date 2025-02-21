import { Request, Response } from "express";
import { CreateSecurityBoxDTO, CustomError } from "../../domain";
import { SecurityService } from "../services/security_controller.service";

export class SecurityBoxController {
  constructor(private readonly securityService: SecurityService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: "Something went very wrong" });
  };

  createSecurityBox = async (req: Request, res: Response) => {
    const [error, createSecurityDTO] = CreateSecurityBoxDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.securityService
      .createSecurity(createSecurityDTO!)
      .then((data) => {
        return res.status(201).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };

  getAllSecurityBox = async (req: Request, res: Response) => {
    const validOrderBy = ["name", "createdAt", "credentialCount"];
    const orderBy =
      (req.query.orderBy as "name" | "createdAt" | "credentialCount") || "name";

    if (orderBy && !validOrderBy.includes(orderBy)) {
      return res.status(400).json({
        message: `Invalid orderBy value`,
      });
    }

    const validOrderDirection = ["ASC", "DESC"];
    const orderDirection =
      (req.query.orderDirection as "ASC" | "DESC") || "ASC";

    if (orderDirection && !validOrderDirection.includes(orderDirection)) {
      return res.status(400).json({
        message: `Invalid orderDirection value`,
      });
    }

    const favorite =
      req.query.favorite !== undefined ? req.query.favorite === "true" : null;

    if (
      req.query.favorite !== undefined &&
      req.query.favorite !== "true" &&
      req.query.favorite !== "false"
    ) {
      return res.status(400).json({
        message: "Invalid favorite value ",
      });
    }

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    this.securityService
      .showSecurity(orderBy, orderDirection, favorite, page, limit)
      .then((data) => {
        return res.status(201).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };

  getOneSecurity = async (req: Request, res: Response) => {
    const { id } = req.params;
    this.securityService
      .getOneSecurity(id)
      .then((data: any) => {
        res.status(200).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };

  editSecurity = async (req: Request, res: Response) => {
    const { id } = req.params;

    console.log(id);

    this.securityService
      .updateSecurity(id, req.body)
      .then((data: any) => {
        return res.status(200).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };

  deleteSecurity = async (req: Request, res: Response) => {
    const { id } = req.params;

    this.securityService
      .deleteSecurity(id)
      .then((data: any) => {
        return res.status(204).json(data);
      })
      .catch((error: any) => this.handleError(error, res));
  };
}
