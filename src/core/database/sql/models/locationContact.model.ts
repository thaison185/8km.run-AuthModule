<<<<<<< HEAD:src/core/database/sql/entities/locationContact.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
=======
import { Column } from "typeorm";
>>>>>>> c1a4aea3b3776083da7a9726ed509c3af5ba0136:src/core/database/sql/models/locationContact.model.ts

export class LocationContact {
	@PrimaryGeneratedColumn("uuid") // To escape error (no primary column)
	id: string;

	@Column({ nullable: false })
	contactName: string;

	@Column({ nullable: false })
	contactEmail: string;

	@Column({ nullable: false })
	contactHotline: string;
}
