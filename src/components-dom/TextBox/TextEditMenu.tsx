import { useContext, useEffect, useRef, useState } from 'react';
import styles from './TextEditMenu.module.scss';
import classNames from 'classnames';
import { MainDivContext } from '../../views/SpaceMain/SpaceMain';
import { createPortal } from 'react-dom';
import { absoluteStateToScreenState } from '@thinairthings/zoom-utils';
import { useViewportStateContext } from '../../context/SpaceContext';
import { Editor } from '@tiptap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold } from '@fortawesome/free-solid-svg-icons';
import { useStorageContainerState } from '@thinairthings/liveblocks-model';
import { useStorage } from '../../context/LiveblocksContext';
export const TextEditMenu = ({nodeId, editor}: {
    nodeId: string
    editor: Editor
}) => {
    // Refs
    const mainDivRef = useContext(MainDivContext)
    const textEditMenuRef = useRef<HTMLDivElement>(null)
    const colorPickerRef = useRef<HTMLInputElement>(null)
    // State
    const containerState = useStorageContainerState(useStorage, nodeId)
    const [viewportState] = useViewportStateContext()
    // Effects
    useEffect(() => {
        const {x, y} = absoluteStateToScreenState(viewportState, containerState)
        textEditMenuRef.current!.style.transform = `translate(${x}px, ${y}px)`
    }, [containerState.x, containerState.y, viewportState])
    return(
        <>
            {createPortal(
                <div ref={textEditMenuRef} className={classNames(styles.textEditMenu)}>
                    <div className={classNames({[styles.active]: editor?.isActive('bold')})}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                        <FontAwesomeIcon icon={faBold}/>
                    </div>
                    <div onClick={() => colorPickerRef.current!.click()}>
                        <img src="/graphics/color-wheel.png"/>
                        <input 
                            ref={colorPickerRef} 
                            type="color" 
                            onChange={()=>editor.chain().focus().run()}
                            onInput={(event) => {
                                event.preventDefault()
                                editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()
                            }}
                        />
                    </div>
                </div>,
                mainDivRef!
            )}
        </>
    )
}