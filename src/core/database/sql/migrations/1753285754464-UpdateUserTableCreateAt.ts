import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTableCreateAt1753285754464 implements MigrationInterface {
	name = "UpdateUserTableCreateAt1753285754464";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT now()`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" DROP DEFAULT`);
	}
}
