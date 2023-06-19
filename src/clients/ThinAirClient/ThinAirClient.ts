import { websocketFetch } from '@thinairthings/websocket-client'

export abstract class Command {
    abstract payload: any
    abstract returnType: any
    constructor(
        apiType: 'REST',
        apiName: string,
        commandName: string,
        methodType: "GET" | "POST"
    );
    constructor(
        apiType: 'WEBSOCKET',
        apiName: string,
        commandName: string,
    );
    constructor(
        public apiType: 'REST' | 'WEBSOCKET',
        public apiName: string,
        public commandName: string, 
        public methodType?: "GET" | "POST"
    ) {}
}

export class ThinAirClient {
    constructor(public rootDomain: string, public userDetails: {
        userId: string | null,
        accessToken: string | null
    }) {}
    send = async <T extends Command>(command: T):Promise<T['returnType']> => {
        if (command.apiType === 'REST') {
            return this.handleRestCommand(command)
        }
        if (command.apiType === 'WEBSOCKET') {
            return this.handleWebsocketCommand(command)
        }
    }
    private handleWebsocketCommand = async <T extends Command>(command: T):Promise<T['returnType']> => {
        try {
            const response =  await websocketFetch({
                url: `wss://${command.apiName}.api.${this.rootDomain}`,
                action: command.commandName,
                payload: {
                    authorization: this.userDetails?.accessToken,
                    ...command.payload
                }
            })
            return response
        } catch (e) {
            console.log(e)
        }
    }
    private handleRestCommand = async <T extends Command>(command: T):Promise<T['returnType']> => {
        try {
            const url = new URL(`https://${command.apiName}.api.${this.rootDomain}/${command.commandName}`)
            if (command.methodType === 'GET'){
                url.search = new URLSearchParams({
                    ...command.payload,
                    userId: this.userDetails?.userId
                }).toString()
            }
            const response = await fetch(url, {
                method: command.methodType,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.userDetails?.accessToken}`
                },
                body: command.methodType === "POST" ? JSON.stringify({
                    ...command.payload,
                    userId: this.userDetails?.userId
                }): null,
                mode: 'cors' 
            })
            // Check if response is no content
            if (response.status === 204) { 
                return
            }
            const result = await response.json()
            // Check for Errors
            if (!response.ok) {
                throw new Error(result.message)
            }
            return result
        } catch (e) {
            console.log(e)
        }
    }
}

