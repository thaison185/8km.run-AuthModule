import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleIdUserTable1757256665561 implements MigrationInterface {
	name = "AddGoogleIdUserTable1757256665561";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ADD "google_id" character varying`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
	}
}
