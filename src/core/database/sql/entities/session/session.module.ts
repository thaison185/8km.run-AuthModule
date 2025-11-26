import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./session.entity";
// import { S } from "./refresh-token.repository";

@Module({
	imports: [TypeOrmModule.forFeature([Session])],
	providers: [],
	exports: []
})
export class SessionRepositoryModule {}
