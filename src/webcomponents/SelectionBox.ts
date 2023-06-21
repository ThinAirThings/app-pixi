
import { Point, mouseRect } from '@thinairthings/mouse-utils'
export class SelectionBox extends HTMLElement {
    shadowRoot!: ShadowRoot
    constructor(public mouseDownPoint: Point){
        super()
        this.shadowRoot = this.attachShadow({mode: 'open'})
        this.shadowRoot.append(this.template({
            mouseDownPoint
        }).content.cloneNode(true))
    }
    template = (mouseDownPoint: Point) => {
        const t = document.createElement('template')
        t.innerHTML = /*html*/`
            <style>
                :host {
                    position: absolute;
                    z-index: 2;
                    border: 1px dotted #111111;
                    background-color: rgba(17,17,17,0.1);
                    left: ${mouseDownPoint.x}px;
                    top: ${mouseDownPoint.y}px; 
                    backface-visibility: hidden;
                } 
            </style>
        `
        return t
    }
    update = (mouseMovePoint: Point) => {
        const mouseBounds = mouseRect(this.mouseDownPoint, mouseMovePoint) 
        this.style.left = `${mouseBounds.x}px`
        this.style.top = `${mouseBounds.y}px`
        this.style.width = `${mouseBounds.width}px`
        this.style.height = `${mouseBounds.height}px`
    }
}
if (!customElements.get('selection-box')){
    customElements.define('selection-box', SelectionBox)
}