import { useDraggable } from '@dnd-kit/core'
import { CSS } from "@dnd-kit/utilities"

import { selectFilter, selectSettings } from '@/lib/features/ScheduleDataSlice'
import { useAppSelector } from '@/lib/hooks'

import { 
    Selection as SelectionInterface
} from '@/types'
import { useEffect } from 'react'

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

    const settings = useAppSelector(selectSettings)

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
        display: (props.selection.name === 'none' ? "none" : "block"),
        backgroundColor: (settings.colorSelectionSubjects ? settings.colors[props.selection.subject] : "")
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