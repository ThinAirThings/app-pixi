import { ScreenState } from "@thinairthings/zoom-utils";
import { BaseTexture, GLTexture, Renderer, Resource } from "@pixi/webworker";


export class ApplicationTextureResource extends Resource {
    dirtyBitmap: ImageBitmap
    dirtyRect: ScreenState
    canvas: OffscreenCanvas
    firstRender: boolean = true
    baseRect: ImageBitmap
    desiredWidth: number
    desiredHeight: number
    constructor(screenState: ScreenState){
        super(screenState.width, screenState.height)
        this.baseRect = this.createBlankImageBitmap(screenState.width, screenState.height)
        this.desiredWidth = screenState.width
        this.desiredHeight = screenState.height
    }
    uploadDirtyFrame(dirtyRect: ScreenState, dirtyBitmap: ImageBitmap) {
        this.dirtyRect = dirtyRect
        this.dirtyBitmap = dirtyBitmap
        this.update()
    }
    resizeTexture(width: number, height: number) {
        this.baseRect = this.createBlankImageBitmap(width, height)
        this.desiredWidth = width
        this.desiredHeight = height
        this.update()
    }
    upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture): boolean {
        // This info ios usseful if upload happens second time
        // Some people use that to track used memory
        const { gl } = renderer;
        if (glTexture.width !== this.desiredWidth || glTexture.height !== this.desiredHeight) {
            gl.texImage2D(
                baseTexture.target, 
                0, 
                baseTexture.format, 
                baseTexture.format, 
                baseTexture.type, 
                this.baseRect
            );
            glTexture.width = this.desiredWidth;
            glTexture.height = this.desiredHeight;
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
    private createBlankImageBitmap(width: number, height: number) {
        const canvas = new OffscreenCanvas(width, height)
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)
        return canvas.transferToImageBitmap()
    }
}