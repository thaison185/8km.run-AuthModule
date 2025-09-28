import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailOtpTable1759054423934 implements MigrationInterface {
	name = "AddEmailOtpTable1759054423934";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "email_otp" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "otp_hash" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "attempt_count" integer NOT NULL DEFAULT '0', "used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_22497c8e99f18a4e668e54a3eec" PRIMARY KEY ("id"))`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "email_otp"`);
	}
}
