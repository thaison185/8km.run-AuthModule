import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Record } from "./record.entity";
import { RecordRepository } from "./record.repository";

@Module({
	imports: [TypeOrmModule.forFeature([Record])],
	providers: [RecordRepository],
	exports: [RecordRepository]
})
export class RecordModule {}
