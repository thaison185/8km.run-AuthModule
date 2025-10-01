import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailOtp } from "./email-otp.entity";
import { EmailOtpRepository } from "./email-otp.repository";

@Module({
	imports: [TypeOrmModule.forFeature([EmailOtp])],
	providers: [EmailOtpRepository],
	exports: [EmailOtpRepository]
})
export class EmailOtpRepositoryModule {}
