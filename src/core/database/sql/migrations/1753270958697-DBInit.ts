import { MigrationInterface, QueryRunner } from "typeorm";

export class DBInit1753270958697 implements MigrationInterface {
	name = "DBInit1753270958697";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('M', 'F', 'O')`);
		await queryRunner.query(
			`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "gender" "public"."users_gender_enum" NOT NULL, "is_pic" boolean, "qrCode" character varying, "clubs" json, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_3d0a60dd2d495c46c5ed1a457c1" UNIQUE ("qrCode"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(`CREATE TYPE "public"."records_role_enum" AS ENUM('runner', 'organizer', 'volunteer')`);
		await queryRunner.query(
			`CREATE TABLE "records" ("user_id" uuid NOT NULL, "event_id" uuid NOT NULL, "finishTime" integer NOT NULL, "role" "public"."records_role_enum" NOT NULL, "badge" json, CONSTRAINT "PK_133d4aa524e0ee2f1fe5aafefb6" PRIMARY KEY ("user_id", "event_id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "description" text NOT NULL, "location_id" uuid, CONSTRAINT "UQ_dfa3d03bef3f90f650fd138fb38" UNIQUE ("name"), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "location_contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactName" character varying NOT NULL, "contactEmail" character varying NOT NULL, "contactHotline" character varying NOT NULL, CONSTRAINT "PK_978e5adb29f49f2bcc3e887caee" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "location_details" ("location_id" uuid NOT NULL, CONSTRAINT "PK_bc3d33c9c8b950641be6cb7a147" PRIMARY KEY ("location_id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "regions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_1eb9a8899a7db89f6ba473fd847" UNIQUE ("name"), CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "coordinate" character varying NOT NULL, "description" text NOT NULL, "contacts" json NOT NULL, "region_id" uuid, CONSTRAINT "UQ_227023051ab1fedef7a3b6c7e2a" UNIQUE ("name"), CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "donations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "amount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, "location_id" uuid, CONSTRAINT "PK_c01355d6f6f50fc6d1b4a946abf" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "records" ADD CONSTRAINT "FK_27b2efc240866f140b8eb6ac554" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "records" ADD CONSTRAINT "FK_b66e8a730109a0d7bdbaa4828b0" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "events" ADD CONSTRAINT "FK_fccf31c64ec14a66276e9999730" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "location_details" ADD CONSTRAINT "FK_bc3d33c9c8b950641be6cb7a147" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "locations" ADD CONSTRAINT "FK_0a0b8e70186ad9f217aada283ad" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "donations" ADD CONSTRAINT "FK_5f99e56a11722ef3f0885308ed2" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "donations" DROP CONSTRAINT "FK_5f99e56a11722ef3f0885308ed2"`);
		await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "FK_0a0b8e70186ad9f217aada283ad"`);
		await queryRunner.query(`ALTER TABLE "location_details" DROP CONSTRAINT "FK_bc3d33c9c8b950641be6cb7a147"`);
		await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_fccf31c64ec14a66276e9999730"`);
		await queryRunner.query(`ALTER TABLE "records" DROP CONSTRAINT "FK_b66e8a730109a0d7bdbaa4828b0"`);
		await queryRunner.query(`ALTER TABLE "records" DROP CONSTRAINT "FK_27b2efc240866f140b8eb6ac554"`);
		await queryRunner.query(`DROP TABLE "donations"`);
		await queryRunner.query(`DROP TABLE "locations"`);
		await queryRunner.query(`DROP TABLE "regions"`);
		await queryRunner.query(`DROP TABLE "location_details"`);
		await queryRunner.query(`DROP TABLE "location_contacts"`);
		await queryRunner.query(`DROP TABLE "events"`);
		await queryRunner.query(`DROP TABLE "records"`);
		await queryRunner.query(`DROP TYPE "public"."records_role_enum"`);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
	}
}
