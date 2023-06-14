import { Command } from "../ThinAirClient";

export class GetSpacesCommand extends Command {
    returnType!: {
        rooms: Array<{
            createdAt: string
            defaultAccesses: Array<string>
            groupsAccesses: Record<string, Array<string>>
            usersAccesses: Record<string, Array<string>>
            id: string
            lastConnectionAt: string
            type: string
            metadata: {
                spaceDisplayName: string
                roomCreatorId: string
            }
        }>
    }
    constructor(public payload: {
        userId: string
    }) {
        super(`devliveblocksv2`, 'get-rooms', 'GET')
    }
}