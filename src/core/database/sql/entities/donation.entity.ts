import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.entity";

@Entity("donations")
export class Donation {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Location, (location) => location.donations)
	@JoinColumn({ name: "location_id" })
	location: Location;

	@Column({ nullable: false })
	name: string;

	@Column({ nullable: false })
	amount: number;

	@Column({ nullable: false })
	createdAt: Date;
}
