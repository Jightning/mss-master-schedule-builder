import { useEffect, useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import Selection from './Selection'
import { 
    Column as ColumnInterface, 
    Row,
    ActiveSelectionInterface
} from '@/types'
import { DragOverlay } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

import { newRows, selectSubjects } from '@/lib/features/ScheduleDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectRows, selectFilter } from '@/lib/features/ScheduleDataSlice';

const Column = (props: {
    activeSelection: ActiveSelectionInterface | null, 
    column: ColumnInterface, 
    heights: Array<number>,
}) => {
    const rows: Array<Row> = useAppSelector(selectRows)

    return (
        <div>  
            {rows && rows.map((row: Row, index: number) => <Cell activeSelection={props.activeSelection} row={row} heights={props.heights} index={index} columnId={props.column.id} key={"overlay-" + row.id} />)}

            <DragOverlay dropAnimation={null} modifiers={[restrictToWindowEdges]}>
                {props.activeSelection ? (
                    <Selection selection={{...props.activeSelection.selection, id: props.activeSelection.selection.id}}
                            selectionId={props.activeSelection.selection.id + "-overlay"}
                            classNames={"selection-overlay"}  />
                ): null}
            </DragOverlay>
        </div>
    )
}

const Cell = ({activeSelection, heights, index, columnId, row}: any) => {
    let dispatch = useAppDispatch()

    const rows: Array<Row> = useAppSelector(selectRows)
    const setRows: any = (val: Array<Row>) => dispatch(newRows(val))

    const filter = useAppSelector(selectFilter)
    const subjects = useAppSelector(selectSubjects)
    
    const {setNodeRef, isOver} = useDroppable({
        id: columnId + "-" + row.id,
        data: {
            rowIndex: index,
            columnId: columnId
        }
    })

    const style = {
        opacity: (isOver ? 0.5 : 1)
    }
    
    // BUG -> Fid a way to make the the tile only change height when the shade is higher to prevent overflow
    useEffect(() => {
        if (isOver) {
            // strange way to signal the useEffect which changes the height on hover over
            setRows([...rows])
        }        
    }, [isOver])

    const isSubjectNone = !subjects.some((subject: any) => subject.name === row.subject)

    if ((filter.rows.searchTerm !== "" && !(row.name.trim().toLowerCase()).includes(filter.rows.searchTerm.trim().toLowerCase()))
     || (filter.rows.subjects.length !== 0 && !(filter.rows.subjects).includes(row.subject) && !isSubjectNone)
    ) return

    return (
        <div
            ref={setNodeRef} 
            key={columnId + "-" + row.id}
            id={"tile-" + columnId + "-" + row.id} 
            className="column-row"
            style={{
                ...style,
                height: `${heights[index]}px`
            }} >

                <Selection 
                    selection={
                        {...(isOver && activeSelection 
                        ? activeSelection.selection
                        : row.columns[columnId])}
                    }
                    selectionId={columnId + "-" + row.id}
                    rowIndex={index}
                    columnId={columnId} />
        </div>
    )
}

export default Column