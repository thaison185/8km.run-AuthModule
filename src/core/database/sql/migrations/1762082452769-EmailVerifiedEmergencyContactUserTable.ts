import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailVerifiedEmergencyContactUserTable1762082452769 implements MigrationInterface {
	name = "EmailVerifiedEmergencyContactUserTable1762082452769";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "emailVerified" boolean NOT NULL DEFAULT false`);
		await queryRunner.query(`ALTER TABLE "users" ADD "emergencyContactName" character varying`);
		await queryRunner.query(`ALTER TABLE "users" ADD "emergencyContactPhone" character varying`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emergencyContactPhone"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emergencyContactName"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerified"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
	}
}
