import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.entity";
import { Record } from "./record.entity";

@Entity("events")
export class Event {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Location, (location) => location.events)
	@JoinColumn({ name: "location_id" })
	location: Location;

	@Column({ nullable: false, unique: true })
	name: string;

	@Column({ nullable: false })
	date: Date;

	@OneToMany(() => Record, (record) => record.event)
	records: Record[];

	@Column({ type: "text" })
	description: string;
}
