import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { Repository } from "typeorm";
import { EmailOtp } from "./email-otp.entity";

@Injectable()
export class EmailOtpRepository extends BaseRepository<EmailOtp> {
	constructor(@InjectRepository(EmailOtp) repository: Repository<EmailOtp>) {
		super(repository);
	}
}
