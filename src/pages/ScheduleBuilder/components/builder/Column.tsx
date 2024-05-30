import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import Selection from './Selection'
import { 
    Column as ColumnInterface, 
    Row,
    Selection as SelectionInterface
} from '../../types'
import { DragOverlay } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'


const Column = (props: {
    activeSelection: SelectionInterface | null, 
    column: ColumnInterface, 
    rows: Array<Row>, 
    heights: Array<number>
}) => {
    return (
        <div>  
            {/* <div className='column-header'>{props.column.name}</div> */}
            {props.rows && props.rows.map((row: Row, index: number) => {
                const {setNodeRef, isOver} = useDroppable({
                    id: props.column.id + "-" + row.id,
                    data: {
                        rowIndex: index,
                        columnId: props.column.id
                    }
                })

                const style = {
                    color: isOver ? "green" : undefined,
                }

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

                            <Selection selection={
                                {...row.columns[props.column.id],
                                    id: props.column.id + "-" + row.id}} />
                    </div>
                )
            })}

            <DragOverlay dropAnimation={null} modifiers={[restrictToWindowEdges]}>
                {props.activeSelection ? (
                    <Selection selection={{...props.activeSelection, id: props.activeSelection.id + "-overlay"}}
                            classNames={"selection-overlay"}  />
                ): null}
            </DragOverlay>
        </div>
    )
}

export default Column