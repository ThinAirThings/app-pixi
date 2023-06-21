import { Container} from "pixi.js";

export class TxPxContainer extends Container {
    constructor(
        public nodeId: string, 
        public selectionTarget: boolean
    ) {
        super();
    }
}