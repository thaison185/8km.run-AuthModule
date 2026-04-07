import { ID } from "src/common/types";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "../location";

@Entity("donations")
export class Donation {
	@PrimaryGeneratedColumn("uuid")
	id: ID;

	@ManyToOne(() => Location, (location) => location.donations)
	@JoinColumn({ name: "location_id" })
	location: Location;

	@Column({ type: "varchar", nullable: false })
	name: string;

	@Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
	amount: number;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: false })
	createdAt: Date;
}
