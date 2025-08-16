import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTableGenderEnum1755333196750 implements MigrationInterface {
	name = "UpdateUserTableGenderEnum1755333196750";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "records" DROP CONSTRAINT "FK_27b2efc240866f140b8eb6ac554"`);
		await queryRunner.query(`ALTER TABLE "records" DROP CONSTRAINT "FK_b66e8a730109a0d7bdbaa4828b0"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dob"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "dob" date`);
		await queryRunner.query(`ALTER TYPE "public"."users_gender_enum" RENAME TO "users_gender_enum_old"`);
		await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('0', '1', '2')`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "gender" TYPE "public"."users_gender_enum" USING "gender"::"text"::"public"."users_gender_enum"`
		);
		await queryRunner.query(`DROP TYPE "public"."users_gender_enum_old"`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gender" DROP NOT NULL`);
		await queryRunner.query(`ALTER TYPE "public"."records_role_enum" RENAME TO "records_role_enum_old"`);
		await queryRunner.query(`CREATE TYPE "public"."records_role_enum" AS ENUM('0', '1', '2')`);
		await queryRunner.query(
			`ALTER TABLE "records" ALTER COLUMN "role" TYPE "public"."records_role_enum" USING "role"::"text"::"public"."records_role_enum"`
		);
		await queryRunner.query(`DROP TYPE "public"."records_role_enum_old"`);
		await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date" SET DEFAULT now()`);
		await queryRunner.query(`ALTER TABLE "donations" DROP COLUMN "amount"`);
		await queryRunner.query(`ALTER TABLE "donations" ADD "amount" numeric(10,2) NOT NULL`);
		await queryRunner.query(`ALTER TABLE "donations" ALTER COLUMN "createdAt" SET DEFAULT now()`);
		await queryRunner.query(
			`ALTER TABLE "records" ADD CONSTRAINT "FK_27b2efc240866f140b8eb6ac554" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "records" ADD CONSTRAINT "FK_b66e8a730109a0d7bdbaa4828b0" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "records" DROP CONSTRAINT "FK_b66e8a730109a0d7bdbaa4828b0"`);
		await queryRunner.query(`ALTER TABLE "records" DROP CONSTRAINT "FK_27b2efc240866f140b8eb6ac554"`);
		await queryRunner.query(`ALTER TABLE "donations" ALTER COLUMN "createdAt" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "donations" DROP COLUMN "amount"`);
		await queryRunner.query(`ALTER TABLE "donations" ADD "amount" integer NOT NULL`);
		await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "date" DROP DEFAULT`);
		await queryRunner.query(
			`CREATE TYPE "public"."records_role_enum_old" AS ENUM('runner', 'organizer', 'volunteer')`
		);
		await queryRunner.query(
			`ALTER TABLE "records" ALTER COLUMN "role" TYPE "public"."records_role_enum_old" USING "role"::"text"::"public"."records_role_enum_old"`
		);
		await queryRunner.query(`DROP TYPE "public"."records_role_enum"`);
		await queryRunner.query(`ALTER TYPE "public"."records_role_enum_old" RENAME TO "records_role_enum"`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gender" SET NOT NULL`);
		await queryRunner.query(`CREATE TYPE "public"."users_gender_enum_old" AS ENUM('M', 'F', 'O')`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "gender" TYPE "public"."users_gender_enum_old" USING "gender"::"text"::"public"."users_gender_enum_old"`
		);
		await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
		await queryRunner.query(`ALTER TYPE "public"."users_gender_enum_old" RENAME TO "users_gender_enum"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dob"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "dob" TIMESTAMP NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "records" ADD CONSTRAINT "FK_b66e8a730109a0d7bdbaa4828b0" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "records" ADD CONSTRAINT "FK_27b2efc240866f140b8eb6ac554" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}
}
