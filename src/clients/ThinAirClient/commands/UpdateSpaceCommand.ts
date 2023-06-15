import { Command } from "../ThinAirClient";


export class UpdateSpaceCommand extends Command {
    returnType!: void;
    constructor(public payload: {
        spaceId: string,
        spaceDisplayName: string
    }) {
        super(`devliveblocksv2`, 'update-room', 'POST')
    }
}