import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("location_contacts")
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
