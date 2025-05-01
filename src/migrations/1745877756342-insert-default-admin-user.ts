import { MigrationInterface, QueryRunner } from "typeorm";
import bcrypt from "bcrypt";

export class InsertDefaultAdminUserUser1745877756342
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("123456789", salt);
    await queryRunner.query(`
      INSERT INTO users (name, email, password, type)
      VALUES ('Admin', 'admin@email.com', '${hash}', 'admin')
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users
      WHERE email = 'admin@email.com';
    `);
  }
}
