import { useDraggable } from '@dnd-kit/core'
import { CSS } from "@dnd-kit/utilities"

import { selectSettings, selectSubjects } from '@/lib/features/ScheduleDataSlice'
import { useAppSelector } from '@/lib/hooks'

import { 
    Column,
    Selection as SelectionInterface
} from '@/types'

import { useContextMenu } from "react-contexify";  
import "react-contexify/dist/ReactContexify.css";
import ContextMenu from '@/src/components/ContextMenu'

const Selection = (props: 
    { 
        selection: SelectionInterface | null,
        selectionId: SelectionInterface["id"]
        rowIndex?: number,
        columnId?: Column["id"],
        classNames?: string 
    }) => {

    if (!props.selection || props.selection.id == null || props.selectionId == null) {
        return
    }

    const settings = useAppSelector(selectSettings)
    const subjects = useAppSelector(selectSubjects)

    const subjectsObject = subjects.reduce((acc: any, item) => {
        acc[item.name] = item.color
        return acc
    }, {})
    // const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(true)
    // const [contextMenuPoints, setContextMenuPoints] = useState({x: 0, y: 0})

    const { show } = useContextMenu({
        id: "selection-" + props.selectionId
    });

    const displayMenu = (e: any) => {
        show({
            event: e,
        });
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
        display: (props.selection.name === 'none' ? "none" : "block"),
        backgroundColor: (settings.isColorSelectionSubjects ? subjectsObject[props.selection.subject] : "")
    }

    return (
        <>
            <ContextMenu selectionId={props.selectionId} selection={props.selection} rowIndex={props.rowIndex} columnId={props.columnId} />

            <div className={'selection-container' + ' ' + (props.classNames ? props.classNames : "")}
                id={'selection-' + props.selectionId}
                ref={setNodeRef} 
                style={style} 
                {...listeners} 
                {...attributes}
                onContextMenu={displayMenu}>
                    {props.selection.name}
            </div>
        </>

    )
}

export default Selection