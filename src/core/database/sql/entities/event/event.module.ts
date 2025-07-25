import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./event.entity";
import { EventRepository } from "./event.repository";

@Module({
	imports: [TypeOrmModule.forFeature([Event])],
	providers: [EventRepository],
	exports: [EventRepository]
})
export class EventRepositoryModule {}
