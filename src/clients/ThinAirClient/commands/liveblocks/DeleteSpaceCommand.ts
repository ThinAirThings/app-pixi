
import { Command } from "../../ThinAirClient";

export class DeleteSpaceCommand extends Command {
    returnType!: void;
    constructor(public payload: {
        spaceId: string
    }) {
        super('REST', `devliveblocksv2`, 'delete-room', 'POST')
    }
}