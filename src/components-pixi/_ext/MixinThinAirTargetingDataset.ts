import { Container, Graphics, Sprite } from "pixi.js";
import { TransformTargetType } from "../../hooks/pointerActions/usePointerActions";

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
        transformtargettype?: TransformTargetType
        isapplicationtarget?: string
        ispixitarget?: string
        isdomtarget?: string
    } = {};

    private constructor(...args: any[]) {
        super(...args.slice(8));
        const [
            nodeid, 
            isselectiontarget, 
            isviewport, 
            istransformtarget, 
            transformtargettype, 
            isapplicationtarget,
            ispixitarget,
            isdomtarget
        ] = args;
        
        this.dataset["nodeid"] = nodeid;
        this.dataset["isselectiontarget"] = isselectiontarget?.toString();
        this.dataset["isviewport"] = isviewport?.toString();
        this.dataset["istransformtarget"] = istransformtarget?.toString();
        this.dataset["transformtargettype"] = transformtargettype;
        this.dataset["isapplicationtarget"] = isapplicationtarget?.toString();
        this.dataset["ispixitarget"] = ispixitarget?.toString();
        this.dataset["isdomtarget"] = isdomtarget?.toString();
    }
    static create({
        nodeid,
        isselectiontarget,
        isviewport,
        istransformtarget,
        transformtargettype,
        isapplicationtarget,
        ispixitarget,
        isdomtarget
    }:{
        nodeid?: string,
        isselectiontarget?: boolean,
        isviewport?: boolean,
        istransformtarget?: boolean
        transformtargettype?: TransformTargetType
        isapplicationtarget?: boolean
        ispixitarget?: boolean
        isdomtarget?: boolean
    }, args?: ConstructorParameters<T>) {
        return new MixedInClass(
            nodeid ?? null, 
            isselectiontarget ?? null,
            isviewport ?? null,
            istransformtarget ?? null,
            transformtargettype ?? null,
            isapplicationtarget ?? null,
            ispixitarget ?? null,
            isdomtarget ?? null,
            ...(args ?? [])
        );
    }
  };
}

// Declare Type Mixins
export type TxPxGraphics = MixedInTargetType<typeof Graphics>
export type TxPxContainer = MixedInTargetType<typeof Container>
export type TxPxSprite = MixedInTargetType<typeof Sprite>