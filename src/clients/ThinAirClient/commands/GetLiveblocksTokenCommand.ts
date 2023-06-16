import { Command } from "../ThinAirClient";

export class GetLiveblocksTokenCommand extends Command {
    returnType!: {
        token: string
    };
    constructor(public payload: {
        spaceId: string
    }) {
        super(`devliveblocksv2`, 'get-token', 'GET')
    }
}