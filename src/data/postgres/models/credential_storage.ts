import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SecurityBox } from "./security_box";
import { Pin } from "./pin";
import { Status } from "../../../config/regular-exp";
import { encryptData } from "../../../config/crypto.adapter";

@Entity()
export class CredentialStorage extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 100,
    nullable: false,
  })
  account: string;

  @Column("varchar", {
    length: 225,
    nullable: false,
  })
  password: string;

  @Column("text", {
    nullable: false,
  })
  description: string;

  @Column("varchar", {
    length: 20,
  })
  code_1: string;

  @Column("varchar", {
    length: 20,
  })
  code_2: string;

  @Column("enum", {
    enum: Status,
    default: Status.ACTIVE,
  })
  status: string;

  @Column("varchar", {
    nullable: false,
  })
  securityId: string;

  @Column("varchar", {
    nullable: false,
  })
  pinId: string;

  @ManyToOne(() => SecurityBox, (securityBox) => securityBox.credentialsStorage)
  securityBox: SecurityBox;

  @ManyToOne(() => Pin, (pin) => pin.credentialsStorage)
  @JoinColumn({ name: "pinId" })
  pin: Pin;

  @BeforeInsert()
  encryptedPassword() {
    this.password = encryptData(this.password)
  }
}
