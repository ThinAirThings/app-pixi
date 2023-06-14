import { Command } from "../ThinAirClient";

export class CreateSpaceCommand extends Command {
    constructor(public payload: {
        spaceDisplayName: string
    }) {
        super(`devliveblocksv2`, 'create-room', 'POST')
    }
}