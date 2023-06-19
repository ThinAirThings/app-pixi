import { Command } from "../../ThinAirClient";

export class CreateSpaceCommand extends Command {
    returnType!: void;
    constructor(public payload: {
        spaceDisplayName: string
    }) {
        super('REST', `devliveblocksv2`, 'create-room', 'POST')
    }
}