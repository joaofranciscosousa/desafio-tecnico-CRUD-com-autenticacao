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
  IsDateString,
  IsEmail,
  Matches,
} from "class-validator";
import { clientsLocale } from "../locales";
import { AppDataSource } from "../data-source";
import H from "../helper/entities";

@Entity("clients")
export class Clients {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ length: 255, nullable: false, type: "varchar" })
  @IsNotEmpty({
    message: H.notNullMessageError(clientsLocale.attributes.name),
  })
  @IsString({
    message: H.fieldTypeMessageError(clientsLocale.attributes.name, "string"),
  })
  name: string;

  @Column({ length: 255, nullable: false, type: "varchar" })
  @IsNotEmpty({
    message: H.notNullMessageError(clientsLocale.attributes.email),
  })
  @IsString({
    message: H.fieldTypeMessageError(clientsLocale.attributes.email, "string"),
  })
  @IsEmail(
    {},
    {
      message: H.invalidFieldMessageError(clientsLocale.attributes.email),
    }
  )
  email: string;

  @Column({ length: 255, nullable: false, type: "varchar" })
  @IsNotEmpty({
    message: H.notNullMessageError(clientsLocale.attributes.phone),
  })
  @IsString({
    message: H.fieldTypeMessageError(clientsLocale.attributes.phone, "string"),
  })
  @Matches(/^\d*$/, {
    message: H.invalidFieldMessageError(clientsLocale.attributes.phone),
  })
  phone: string;

  @Column({ nullable: false, type: "datetime" })
  @IsNotEmpty({
    message: H.notNullMessageError(clientsLocale.attributes.phone),
  })
  @IsDateString(
    {},
    {
      message: `O campo ${clientsLocale.attributes.bornDate} deve ser uma string datetime`,
    }
  )
  born_date: Date;

  @Column({ nullable: false, type: "datetime" })
  created_at: Date;

  @Column({ nullable: false, type: "datetime" })
  updated_at: Date;

  // HOOKS
  @BeforeInsert()
  async beforeInsert() {
    await validateOrReject(this);
    await this.isUniqueEmail(this.email);
  }

  @BeforeUpdate()
  async beforeUpdate() {
    await validateOrReject(this);
    await this.isUniqueEmail(this.email, this.id);
  }

  private async isUniqueEmail(email: string, id?: number) {
    const clientRepository = AppDataSource.getRepository(Clients);
    const duplicatedRecord = await clientRepository.findOne({
      where: { email },
    });

    if (duplicatedRecord && duplicatedRecord.id !== id) {
      throw `Já existe um ${clientsLocale.model.singular} com o ${clientsLocale.attributes.email} fornecido.`;
    }
  }
}
