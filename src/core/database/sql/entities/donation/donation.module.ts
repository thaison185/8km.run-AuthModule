import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Donation } from "./donation.entity";
import { DonationRepository } from "./donation.repository";

@Module({
	imports: [TypeOrmModule.forFeature([Donation])],
	providers: [DonationRepository],
	exports: [DonationRepository]
})
export class DonationRepositoryModule {}
