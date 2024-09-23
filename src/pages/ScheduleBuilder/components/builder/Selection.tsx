import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from "@dnd-kit/utilities"

import { 
    Selection as SelectionInterface
} from '@/types'

const Selection = (props: 
    { 
        selection: SelectionInterface | null,
        selectionId: SelectionInterface["id"]
        rowIndex?: number,
        columnId?: string | number,
        classNames?: string 
    }) => {

    if (!props.selection || props.selection.id == null || props.selectionId == null) {
        return
    }

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: 'selection-' + props.selectionId,
        data: { 
            selection: props.selection,
            rowIndex: props.rowIndex,
            columnId: props.columnId
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        display: (props.selection.name === 'none' ? "none" : "block")
    }

    return (
        <div className={'selection-container' + ' ' + (props.classNames ? props.classNames : "")}
            id={'selection-' + props.selectionId}
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}>

            {props.selection.name}
        </div>
    )
}

export default Selection