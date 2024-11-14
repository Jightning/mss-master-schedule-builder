import { useEffect } from 'react'
import { useDroppable } from '@dnd-kit/core'
import Selection from './Selection'
import { 
    Column as ColumnInterface, 
    Row,
    ActiveSelectionInterface
} from '@/types'
import { DragOverlay } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

import { newRows } from '@/lib/features/ScheduleDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectRows, selectFilter } from '@/lib/features/ScheduleDataSlice';

const Column = (props: {
    activeSelection: ActiveSelectionInterface | null, 
    column: ColumnInterface, 
    heights: Array<number>,
}) => {
    let dispatch = useAppDispatch()

    const rows: Array<Row> = useAppSelector(selectRows)
    const setRows: any = (val: Array<Row>) => dispatch(newRows(val))

    const filter = useAppSelector(selectFilter)

    return (
        <div>  
            {rows && rows.map((row: Row, index: number) => {
                const {setNodeRef, isOver} = useDroppable({
                    id: props.column.id + "-" + row.id,
                    data: {
                        rowIndex: index,
                        columnId: props.column.id
                    }
                })

                const style = {
                    color: "rgba(0, 0, 0, " + (isOver ? 0.4 : 1) + ")",
                }
                
                // BUG -> Fid a  way to make the the tile only change height when the shade is higher to prevent overflow
                useEffect(() => {
                    if (isOver) {
                        // strange way to signal the useEffect which changes the height on hover over
                        setRows([...rows])
                    }        
                }, [isOver])

                if ((filter.rows.searchTerm !== "" && !(row.name.trim().toLowerCase()).includes(filter.rows.searchTerm.trim().toLowerCase()))
                    || (filter.rows.subjects.length !== 0 && !(filter.rows.subjects).includes(row.subject)))
                    return <></>

                return (
                    <div
                        ref={setNodeRef} 
                        key={props.column.id + "-" + row.id}
                        id={"tile-" + props.column.id + "-" + row.id} 
                        className="column-row"
                        style={{
                            ...style,
                            height: `${props.heights[index]}px`
                        }} >

                            <Selection 
                                selection={
                                    {...(isOver && props.activeSelection 
                                    ? props.activeSelection.selection
                                    : row.columns[props.column.id])}
                                }
                                selectionId={props.column.id + "-" + row.id}
                                rowIndex={index}
                                columnId={props.column.id} />
                    </div>
                )
            })}

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

export default Column