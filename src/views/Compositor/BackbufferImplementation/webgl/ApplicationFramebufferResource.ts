import { ContainerState, ScreenState } from "@thinairthings/zoom-utils";
import { BaseTexture, GLTexture, Renderer, Resource } from "@pixi/webworker";


export class ApplicationFramebufferResource extends Resource {
    dirtyBitmap: ImageBitmap
    dirtyRect: ScreenState
    canvas: OffscreenCanvas
    firstRender: boolean = true
    baseRect: ImageBitmap
    constructor(containerState: ContainerState){
        super(containerState.width, containerState.height)
        const canvas = new OffscreenCanvas(containerState.width, containerState.height)
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, containerState.width, containerState.height)
        this.baseRect = canvas.transferToImageBitmap()
        console.log(this)
    }
    uploadDirtyFrame(dirtyBitmap: ImageBitmap, dirtyRect: ScreenState) {
        this.dirtyBitmap = dirtyBitmap
        this.dirtyRect = dirtyRect
        this.update()
    }
    upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture): boolean {
        const { width } = this; // default size or from baseTexture?
        const { height } = this; // your choice.
        // This info ios usseful if upload happens second time
        // Some people use that to track used memory
        glTexture.width = width;
        glTexture.height = height;

        // PURE WEBGL CALLS - that's what its all about.
        // PixiJS cant wrap all that API, we give you acceess to it!
        const { gl } = renderer;
        if (this.firstRender) {
            gl.texImage2D(
                baseTexture.target, 
                0, 
                baseTexture.format, 
                baseTexture.format, 
                baseTexture.type, 
                this.baseRect
            );
            this.firstRender = false
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
}