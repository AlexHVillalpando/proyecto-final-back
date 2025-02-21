import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SecurityBox } from "./security_box";
import { Status } from "../../../config/regular-exp";
import { encriptAdapter } from "../../../config/bcrypt.adapter";
import { Pin } from "./pin";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 100,
    nullable: false,
  })
  name: string;

  @Column("varchar", {
    length: 100,
    nullable: false,
  })
  surname: string;

  @Column("varchar", {
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column("varchar", {
    length: 20,
    nullable: false,
  })
  cellphone: string;

  @Column("varchar", {
    length: 225,
    nullable: false,
  })
  password: string;

  @Column("enum", {
    enum: Status,
    default: Status.ACTIVE,
  })
  status: string;

  @Column("varchar", {
    nullable: false,
  })
  pinId: string;

  @OneToMany(() => SecurityBox, (securityBox) => securityBox.user)
  security_boxes: SecurityBox[];

  @OneToOne(() => Pin, (pin) => pin.user)
  @JoinColumn({ name: "Pin" })
  pin: Pin;

  @BeforeInsert()
  encryptedPassword() {
    this.password = encriptAdapter.hash(this.password);
  }
}
