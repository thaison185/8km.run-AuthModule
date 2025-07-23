import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Location } from "./location.entity";
import { LocationRepository } from "./location.repository";

@Module({
	imports: [TypeOrmModule.forFeature([Location])],
	providers: [LocationRepository],
	exports: [LocationRepository]
})
export class LocationModule {}
