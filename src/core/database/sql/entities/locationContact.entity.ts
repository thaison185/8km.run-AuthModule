import { Column, Entity } from "typeorm";

@Entity("location_contacts")
export class LocationContact {
	@Column({ nullable: false })
	contactName: string;

	@Column({ nullable: false })
	contactEmail: string;

	@Column({ nullable: false })
	contactHotline: string;
}
