import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from "@dnd-kit/utilities"

import { 
    Selection as SelectionInterface
} from '../types'

const Selection = (props: 
    { 
        selection: SelectionInterface | null,
        classNames?: string 
    }) => {

    if (!props.selection || props.selection.id == null) {
        return
    }

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: 'selection-' + props.selection.id,
        data: { 
            selection: props.selection,
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div className={'selection-container' + ' ' + props.classNames}
            id={'selection-' + props.selection.id}
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}>

            {props.selection.name}
        </div>
    )
}

export default Selection