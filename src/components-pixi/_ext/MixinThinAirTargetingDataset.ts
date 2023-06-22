import { Container, Graphics } from "pixi.js";

/* 
    What is all this?
    This mixin class is designed to unify the targeting system between the DOM
    and PIXI. The DOM has the ability to add in data objects using the data-* syntax.
    From MDN Docs:
    "By adding data-* attributes, even ordinary HTML elements can become rather complex
    and powerful program-objects. For example, a space-ship "sprite" in a game could be
    a simple <img> element with a class attribute and several data-* attributes."

    The idea here is to unify Pixi with the DOM by allowing the pointer targeting to 
    reuse code between the two systems.
*/

export type MixedInTargetType<T extends new (...args: any[]) => any> = InstanceType<ReturnType<typeof MixinThinAirTargetingDataset<T>>>
// Higher Order Class
export const MixinThinAirTargetingDataset = <T extends new (...args: any[]) => any>(Base: T) => {
  return class MixedInClass extends Base {
    dataset: {
        nodeid?: string,
        isselectiontarget?: string,
        isviewport?: string,
        istransformtarget?: string
    } = {};

    private constructor(...args: any[]) {
        super(...args.slice(4));
        const [nodeid, isselectiontarget, isviewport, istransformtarget] = args[0];
        this.dataset["nodeid"] = nodeid;
        this.dataset["isselectiontarget"] = isselectiontarget?.toString();
        this.dataset["isviewport"] = isviewport?.toString();
        this.dataset["istransformtarget"] = istransformtarget?.toString();
    }
    static create({
        nodeid,
        isselectiontarget,
        isviewport,
        istransformtarget
    }:{
        nodeid?: string,
        isselectiontarget?: boolean,
        isviewport?: boolean,
        istransformtarget?: boolean
    }, args?: ConstructorParameters<T>) {
        return new MixedInClass([
            nodeid ?? null, 
            isselectiontarget ?? null,
            isviewport ?? null,
            istransformtarget ?? null, 
            args ?? []
        ]);
    }
  };
}

// Declare Type Mixins
export type TxPxGraphics = MixedInTargetType<typeof Graphics>
export type TxPxContainer = MixedInTargetType<typeof Container>