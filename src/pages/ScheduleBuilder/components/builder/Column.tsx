import React, { useEffect } from 'react'
import { useDroppable } from '@dnd-kit/core'
import Selection from './Selection'
import { 
    Column as ColumnInterface, 
    Row,
    Selection as SelectionInterface,
    ActiveSelectionInterface
} from '../../types'
import { DragOverlay } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'


const Column = (props: {
    activeSelection: ActiveSelectionInterface | null, 
    column: ColumnInterface, 
    rows: Array<Row>, 
    heights: Array<number>,
    setRows: React.Dispatch<React.SetStateAction<Array<Row>>>
}) => {
    return (
        <div>  
            {props.rows && props.rows.map((row: Row, index: number) => {
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
                        // dumbass way to signal the useEffect which changes the height on hover over
                        // don't want to manually do so, so I'm just going to trigger the already made one by changing rows
                        // (useEffect checks row changes -> it works ok)
                        // maybe make this better later  
                        props.setRows((prevRows) => {
                            const toChange = index;
                            let row = {...prevRows[toChange]}
                
                            return [...prevRows.slice(0, toChange), 
                                    row, 
                                    ...prevRows.slice(toChange + 1)];
                        })
                    }        
                }, [isOver])

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
                                    : row.columns[props.column.id]),

                                    id: props.column.id + "-" + row.id}
                                }
                                rowIndex={index}
                                columnId={props.column.id} />
                    </div>
                )
            })}

            <DragOverlay dropAnimation={null} modifiers={[restrictToWindowEdges]}>
                {props.activeSelection ? (
                    <Selection selection={{...props.activeSelection.selection, id: props.activeSelection.selection.id + "-overlay"}}
                            classNames={"selection-overlay"}  />
                ): null}
            </DragOverlay>
        </div>
    )
}

export default Column