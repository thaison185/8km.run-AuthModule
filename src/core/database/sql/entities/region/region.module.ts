import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Region } from "./region.entity";
import { RegionRepository } from "./region.repository";

@Module({
	imports: [TypeOrmModule.forFeature([Region])],
	providers: [RegionRepository],
	exports: [RegionRepository]
})
export class RegionModule {}
