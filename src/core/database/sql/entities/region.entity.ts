import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.entity";

@Entity("regions")
export class Region {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ nullable: false, unique: true })
	name: string;

	@OneToMany(() => Location, (location) => location.region)
	locations: Location[];
}
