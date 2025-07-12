import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse } from "@nestjs/swagger";
import { ActivateDevice } from "./dtos/active.dto";
import { ConnectDevice } from "./dtos/connect.dto";

@Controller("/api")
export class AuthController {
	// constructor() {}

	@Post("/connect")
	@ApiCreatedResponse({ schema: { type: "object", properties: { token: { type: "string" } } } })
	@ApiConflictResponse()
	@ApiBadRequestResponse()
	@HttpCode(201)
	public async connectDevice(@Body() request: ConnectDevice) {
		return { msg: "Device connected successfully", request };
	}

	@Post("/activate")
	public async activeDevice(@Body() request: ActivateDevice) {
		return { msg: "Device connected successfully", request };
	}
}
