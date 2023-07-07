import { Command } from "../../ThinAirClient";

export class GetSpaceCommand extends Command {
    returnType!: {
        spaceDisplayName: string
    }
    constructor(public payload: {
        spaceId: string
    }) {
        super('REST', `devliveblocksv2`, 'get-room', 'GET')
    }
}