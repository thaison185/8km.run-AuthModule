import { Column } from "typeorm";

export class LocationContact {

	@Column({ nullable: false })
	contactName: string;

	@Column({ nullable: false })
	contactEmail: string;

	@Column({ nullable: false })
	contactHotline: string;
}
