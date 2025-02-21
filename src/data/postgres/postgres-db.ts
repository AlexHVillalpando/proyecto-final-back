import { DataSource } from "typeorm";
import { CredentialStorage } from "./models/credential_storage";
import { Pin } from "./models/pin";
import { SecurityBox } from "./models/security_box";
import { User } from "./models/user";

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export class PostgresDataBase {
  public datasource: DataSource;

  constructor(options: Options) {
    this.datasource = new DataSource({
      type: "postgres",
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.database,
      entities: [CredentialStorage, Pin, SecurityBox, User],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async connect() {
    try {
      await this.datasource.initialize();
      console.log("Database conected 🫠");
    } catch (error) {
      console.log(error);
    }
  }
}
