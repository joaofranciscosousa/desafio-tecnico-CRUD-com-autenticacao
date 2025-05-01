import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import {
  IsString,
  validateOrReject,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
import { userLocale } from "../locales";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";
import H from "../helper/entities";

@Entity("users")
export class Users {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ length: 255, nullable: false, type: "varchar" })
  @IsNotEmpty({
    message: H.notNullMessageError(userLocale.attributes.name),
  })
  @IsString({
    message: H.fieldTypeMessageError(userLocale.attributes.name, "string"),
  })
  name: string;

  @Column({ length: 255, nullable: false, type: "varchar" })
  @IsNotEmpty({
    message: H.notNullMessageError(userLocale.attributes.email),
  })
  @IsString({
    message: H.fieldTypeMessageError(userLocale.attributes.email, "string"),
  })
  email: string;

  @Column({ length: 255, nullable: false, type: "varchar" })
  @IsNotEmpty({
    message: H.notNullMessageError(userLocale.attributes.password),
  })
  @IsString({
    message: H.fieldTypeMessageError(userLocale.attributes.password, "string"),
  })
  password: string;

  @Column({ nullable: false, type: "varchar" })
  @IsEnum(userLocale.attributes.typeOptions, {
    message: `O campo ${userLocale.attributes.type} é inválido. Opções válidas: ${userLocale.attributes.typeOptions}`,
  })
  @IsNotEmpty({
    message: H.notNullMessageError(userLocale.attributes.password),
  })
  @IsString({
    message: H.fieldTypeMessageError(userLocale.attributes.password, "string"),
  })
  type: string;

  @Column({ nullable: false, type: "datetime" })
  created_at: Date;

  @Column({ nullable: false, type: "datetime" })
  updated_at: Date;

  // HOOKS
  @BeforeInsert()
  async beforeInsert() {
    await validateOrReject(this);
    await this.isUniqueEmail(this.email);
    await this.generateHash();
  }

  @BeforeUpdate()
  async beforeUpdate() {
    await validateOrReject(this);
    await this.isUniqueEmail(this.email, this.id);
  }

  private async isUniqueEmail(email: string, id?: number) {
    const userRepository = AppDataSource.getRepository(Users);
    const duplicatedRecord = await userRepository.findOne({
      where: { email },
    });

    if (duplicatedRecord && duplicatedRecord.id !== id) {
      throw `Já existe um ${userLocale.model.singular} com o ${userLocale.attributes.email} fornecido.`;
    }
  }

  private async generateHash() {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
  }
}
