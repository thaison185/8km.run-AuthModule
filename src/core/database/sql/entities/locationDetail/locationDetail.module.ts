import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocationDetail } from "./locationDetail.entity";
import { LocationDetailRepository } from "./locationDetail.repository";

@Module({
	imports: [TypeOrmModule.forFeature([LocationDetail])],
	providers: [LocationDetailRepository],
	exports: [LocationDetailRepository]
})
export class LocationDetailModule {}
