import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserRepositoryModule } from "../../core/database/sql/entities/user/user.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
	imports: [JwtModule.register({}), UserRepositoryModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
