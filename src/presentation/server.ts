import express, { Router } from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import cors from "cors";

interface Option {
  port: number;
  routes: Router;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Option) {
    this.port = options.port;
    this.routes = options.routes;
  }

  async start() {

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true })); 

    this.app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );

    this.app.use(morgan("dev")); 
    this.app.use(hpp());
    this.app.use(helmet());

    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port} 🫠`);
    });
  }
}