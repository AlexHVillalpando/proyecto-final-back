import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CredentialStorage } from "./credential_storage";
import { Status } from "../../../config/regular-exp";
import { User } from "./user";

@Entity()
export class SecurityBox extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 100,
    nullable: false,
  })
  name: string;

  @Column("boolean", {
    default: false
  })
  favorite: boolean;

  @Column("varchar", {
    length: 60,
    default: `person-circle-outline`
  })
  icon: string;

  @Column("enum", {
    enum: Status,
    default: Status.ACTIVE,
  })
  status: string;

  @Column("varchar", {
    nullable: false,
  })
  userId: string;

  @Column("timestamp", {
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date

  @ManyToOne(() => User, (user) => user.security_boxes)
  @JoinColumn({ name: "UserId" })
  user: User

  @OneToMany(() => CredentialStorage, credentialStorage => credentialStorage.securityBox)
  @JoinColumn({ name: "CredentialStorageId" })
  credentialsStorage: CredentialStorage[]
}
