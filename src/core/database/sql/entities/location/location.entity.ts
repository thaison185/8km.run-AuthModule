import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LocationContact } from "../../models/locationContact.model";
import { Donation } from "../donation";
import { Event } from "../event";
import { LocationDetail } from "../locationDetail";
import { Region } from "../region";

@Entity("locations")
export class Location {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Region, (region) => region.locations)
	@JoinColumn({ name: "region_id" })
	region: Region;

	@Column({ type: "varchar", nullable: false, unique: true })
	name: string;

	@Column({ type: "varchar", nullable: false })
	address: string;

	@Column({ type: "varchar", nullable: false })
	coordinate: string;

	@Column({ type: "text" })
	description: string;

	@OneToMany(() => Event, (event) => event.location)
	events: Event[];

	@OneToMany(() => LocationDetail, (detail) => detail.location)
	details: LocationDetail[];

	@OneToMany(() => Donation, (donation) => donation.location)
	donations: Donation[];

	@Column({ type: "json", nullable: false })
	contacts: LocationContact;
}
