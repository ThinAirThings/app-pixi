import { Graphics } from "pixi.js";

export class TxPxGraphics extends Graphics {
    constructor(
        public nodeId: string, 
        public selectionTarget: boolean, 
        ...args: any[]
    ) {
        super(...args);
    }
}