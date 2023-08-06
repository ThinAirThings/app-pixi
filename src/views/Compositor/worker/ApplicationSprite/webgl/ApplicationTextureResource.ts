import { ContainerState, ScreenState } from "@thinairthings/zoom-utils";
import { BaseTexture, GLTexture, Renderer, Resource } from "@pixi/webworker";


export class ApplicationTextureResource extends Resource {
    dirtyBitmap: ImageBitmap
    dirtyRect: ScreenState
    canvas: OffscreenCanvas
    firstRender: boolean = true
    baseRect: ImageBitmap
    currentDimensions: {
        width: number
        height: number
    }
    constructor(containerState: ContainerState){
        const dimensions = ApplicationTextureResource.calculateDimensions(containerState)
        super(dimensions.width,dimensions.height)
        this.baseRect = this.createBlankImageBitmap(dimensions.width, dimensions.height)
        this.currentDimensions = dimensions
    }
    uploadDirtyFrame(dirtyRect: ScreenState, dirtyBitmap: ImageBitmap) {
        this.dirtyRect = dirtyRect
        this.dirtyBitmap = dirtyBitmap
        this.update()
    }
    resizeTexture(containerState: ContainerState) {
        const newDimensions = ApplicationTextureResource.calculateDimensions(containerState)
        if (newDimensions.width === this.currentDimensions.width 
            && newDimensions.height === this.currentDimensions.height
        ) return 
        this.baseRect = this.createBlankImageBitmap(newDimensions.width, newDimensions.height)
        this.currentDimensions = newDimensions
        this.update()
    }
    upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture): boolean {
        // This info ios usseful if upload happens second time
        // Some people use that to track used memory
        const { gl } = renderer;
        if (glTexture.width !== this.currentDimensions.width || glTexture.height !== this.currentDimensions.height) {
            gl.texImage2D(
                baseTexture.target, 
                0, 
                baseTexture.format, 
                baseTexture.format, 
                baseTexture.type, 
                this.baseRect
            );
            glTexture.width = this.currentDimensions.width;
            glTexture.height = this.currentDimensions.height;
        } else {
            gl.texSubImage2D(
                baseTexture.target,     // target
                0,  // level
                this.dirtyRect.x,  // xoffset
                this.dirtyRect.y,  // yoffset
                this.dirtyRect.width,    // width
                this.dirtyRect.height,   // height
                baseTexture.format,     // format
                baseTexture.type,    // type
                this.dirtyBitmap       // pixels
            );
        }
        return true; 
    }
    static calculateDimensions(containerState: ContainerState) {
        return {
            width: Math.round((1/containerState.scale)*containerState.width),
            height: Math.round((1/containerState.scale)*containerState.height)
        }
    }
    private createBlankImageBitmap(width: number, height: number) {
        const canvas = new OffscreenCanvas(width, height)
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)
        return canvas.transferToImageBitmap()
    }
}