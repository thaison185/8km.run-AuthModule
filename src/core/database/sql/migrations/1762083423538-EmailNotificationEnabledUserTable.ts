import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailNotificationEnabledUserTable1762083423538 implements MigrationInterface {
	name = "EmailNotificationEnabledUserTable1762083423538";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ADD "emailNotificationEnabled" boolean NOT NULL DEFAULT false`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailNotificationEnabled"`);
	}
}
