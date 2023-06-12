
export abstract class Command {
    constructor(public apiName: string, public commandName: string, public methodType: 'GET' | 'POST') {}
}

export class ThinAirClient {
    constructor(public rootDomain: string) {

    }
    send = async (command: Command) => {
        return await fetch(`${command.apiName}.api.${this.rootDomain}/${command.commandName}`, {
            method: command.methodType,
        })
    }
    tryRefreshToken = async () => {
        return await fetch(`auth.api.${this.rootDomain}/refresh`, {
            method: 'GET',
            credentials: 'include'
        })
    }
}
