import { Command } from "../../ThinAirClient";
export class AutocompleteInterfaceCommand extends Command {
    returnType!: {
        results: {
            content: string | null
            role: string
            function_call: {
                name: string
                arguments: string
            }
        }
    };
    constructor(public payload: {
        query: string
    }) {
        super('WEBSOCKET', `devai`, 'autocomplete-interface')
    }
}