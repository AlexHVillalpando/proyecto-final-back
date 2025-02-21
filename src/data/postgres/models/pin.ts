import { BaseEntity, BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CredentialStorage } from "./credential_storage";
import { encryptData } from "../../../config/crypto.adapter";
import { User } from "./user";

@Entity()
export class Pin extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 75,
    nullable: false,
  })
  code: string;

  @OneToMany(() => CredentialStorage, credentialStorage => credentialStorage.pin)
  credentialsStorage: CredentialStorage[]

  @OneToOne(() => User, user => user.pin)
  @JoinColumn()
  user: User

  @BeforeInsert()
    encryptedPassword() {
      this.code = encryptData(this.code)
    }
}
