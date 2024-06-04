import React, { useState, useEffect } from 'react'
import "./ScheduleBuilder.css"
import { 
    DndContext,
    DragOverlay
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

import { useDraggable } from "react-use-draggable-scroll";
import { useRef } from 'react';

import Rows from './components/Rows'
import ScheduleTable from './components/ScheduleTable'
import SelectionColumn from './components/SelectionColumn'
import Selection from './components/Selection'
import Toolbar from './components/Toolbar/Toolbar'
import { 
    Selection as SelectionInterface, 
    Column, 
    Row 
} from './types'


const ScheduleBuilder = () => {
    const [rows, setRows] = useState<Array<Row>>([
        { name: "A. Mashburnafdasdasdsadddddddddddddddddddddddddddddddddddddddddddddddddddddd", subject: "math", id: 10394, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "B. Mashburn", subject: "math", id: 10324, columns: {"period_1": {name: "none", id: 1234 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "C. Mashburn", subject: "math", id: 10395, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "D. Mashburn", subject: "math", id: 10396, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "E. Mashburn", subject: "math", id: 10397, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "F. Mashburn", subject: "math", id: 10398, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "G. Mashburn", subject: "math", id: 10399, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "H. Mashburn", subject: "math", id: 10320, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "I. Mashburn", subject: "math", id: 10349, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
    ]);

    const [columns, setColumns] = useState<Array<Column>>([
        { name: "Period 1", id: "period_1" },
        { name: "Period 2", id: "period_2" },
        { name: "Period 3", id: "period_3" },
        { name: "Period 4", id: "period_4" },
        { name: "Period 5", id: "period_5" },
        { name: "Period 6", id: "period_6" },
        { name: "Period 7", id: "period_7" },
        { name: "Period 8", id: "period_8" },
        { name: "Period 9", id: "period_9" }
    ]);  

    const [selections, setSelections] = useState<Array<SelectionInterface>>([
        { name: "Comp Sci", id: 33437 },
        { name: "AP Physics 1", id: 3343855 },
        { name: "AP Physics 2", id: 334348 },
        { name: "AP Physics 3", id: 3343238 },
        { name: "AP Physics 4", id: 3343328 },
        { name: "AP Physics 5", id: 3343548 },
        { name: "AP Physics 6", id: 3343068 },
        { name: "AP Physics 7", id: 334398 },
        { name: "AP Physics 8", id: 334868 },
        { name: "AP Physics 9", id: 334548 },
        { name: "AP Physics 100000000000000000000000000000000000", id: 332448 },
        { name: "AP Physics 11", id: 33443 },
        { name: "AP Physics 12", id: 33428 },
        { name: "AP Physics 13", id: 33438 },
        { name: "AP Physics 14", id: 33238 },
        { name: "AP Physics 15", id: 324238 },
        { name: "AP Physics 16", id: 33644238 },
        { name: "AP Physics 17", id: 33425693832 },
        { name: "AP Physics 18", id: 3342385471},
        { name: "AP Physics 19", id: 3342342532812 },
        { name: "AP Physics 20", id: 33423064223228 },
        { name: "AP Physics 21", id: 3342934228054 },
        { name: "AP Physics 22", id: 334623422807 },
        { name: "AP Physics 23", id: 3342342285708 },
        { name: "AP Physics 24", id: 3342342228 },
        { name: "AP Physics 25", id: 334234282234 },
        { name: "AP Physics 26", id: 3342342854 },
        { name: "AP Physics 27", id: 3342322876 },
        { name: "AP Physics 28", id: 3342422818 },
        { name: "AP Physics 29", id: 3342422828 },
        { name: "AP Physics 30", id: 3342422838 },
        { name: "AP Physics 31", id: 332422848 },
        { name: "AP Physics 32", id: 3342422858 },
        { name: "AP Physics 33", id: 33424228786 },
        { name: "AP Physics 34", id: 3342422868 },
        { name: "AP Physics 35", id: 3342422878 },
        { name: "AP Physics 36", id: 3342422888 },
        { name: "AP Physics 37", id: 3342422898 },
        { name: "AP Physics 38", id: 33424228108 },
        { name: "AP Physics 39", id: 33424228118 }
    ]);

    const [rowsName, setRowsName] = useState("Teachers")
    const [selectionsName, setSelectionsName] = useState("Classes")

    const [activeSelection, setActiveSelection] = useState<SelectionInterface | null>(null);
    const [heights, setHeights] = useState<Array<number>>([])

    // Auto Adjusts the heights of each row in the table
    // To match up the column row heights and the row column heights
    useEffect(() => {   
        if (rows && rows.length > 0) {
            let allHeights: Array<number> = []

            // Set all heights based on row height
            rows.forEach((row: Row) => {
                const rowElement = document.getElementById(`row-${row.id}`)
                let height = rowElement?.offsetHeight;
                // Checks each column in that row to see if any are taller
                columns.forEach((column: Column) => {
                    const selection = document.getElementById("selection-" + column.id + "-" + row.id)
                    if (selection?.offsetHeight && height && selection.offsetHeight + 10 > height) {
                        height = selection?.offsetHeight + 10
                    }
                })
                // Adds heighest height or 0 if there are none
                allHeights.push((height ? height : 0))
            })  
            setHeights(allHeights)
        }
    }, [rows])


    const handleDragStart = (draggable: any) => {
        if (draggable.active) {
            // So the overlay gets shown
            setActiveSelection(draggable.active.data.current.selection)

            let selectionElement = document.getElementById(`${draggable.active.id}`);
            
            if (!selectionElement) {
                return;
            }

            // Hides draggable so that only the overlay is shown
            selectionElement.style.zIndex = "99999"
            selectionElement.style.opacity = "0"

        }
    }

    const handleDragEnd = (element: {active: any, over: any}) => {
        const draggable = element.active
        const droppable = element.over

        // hide overlay
        setActiveSelection(null)
        if (!draggable) {
            return
        }

        // if dragged over nothing, these should still be done
        let selectionElement = document.getElementById(`${draggable.id}`);
        if (!selectionElement) {
            return;
        }
        // Show element again
        selectionElement.style.zIndex = "1" 
        selectionElement.style.opacity = "1"

        if (!droppable) {
            return
        }

        setRows((prevRows) => {
            // Need row index, column id
            // Identifying index of the column to change
            const toChange = droppable.data.current.rowIndex;
            // Id of selection to change
            const columnId = droppable.data.current.columnId
            // pass by value -> cannot return reference, otherwise values will not rerender correctly
            // Row object to change
            let row = {...prevRows[toChange]}

            // row.columns[columnId] is the selection to change

            // setting selection of respective row in respective column to new draggable selection
            row.columns[columnId] = draggable.data.current.selection

            return [...prevRows.slice(0, toChange), 
                    row, 
                    ...prevRows.slice(toChange + 1)];
        })

    }

    // FOR DRAG SCROLL, NOT FOR DRAGGABLE
    const drag_scroll_ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
    const { events } = useDraggable(drag_scroll_ref)

    return (
        <div id="sb-container">
            <DndContext onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToWindowEdges]}>
                <div id="main-container">
                    <div className="header">
                        <h1 className="title">Manhasset Master Schedule Builder</h1>
                    </div>

                    <Toolbar rows={rows} 
                             setRows={setRows}
                             columns={columns}
                             setColumns={setColumns}
                             selections={selections}
                             setSelections={setSelections} />
                    <div className='schedule-container' {...(activeSelection ? null : {...events})} ref={drag_scroll_ref}>
                        <Rows heights={heights} rows={rows} rowsName={rowsName} />
                        <ScheduleTable activeSelection={activeSelection} heights={heights} columns={columns} rows={rows} />
                    </div> 
                </div>

                <div className="selections-container">
                    <div className="selection-header">
                        <h4>{selectionsName}</h4>
                    </div>
                    <SelectionColumn selections={selections} />
                </div>

                {/* To allow the selection to drag over its current div
                    Overlay is what is show when dragging */}
                <DragOverlay dropAnimation={null} modifiers={[restrictToWindowEdges]}>
                    {activeSelection ? (
                        <Selection selection={activeSelection}
                                   classNames={"selection-overlay"} />
                    ): null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default ScheduleBuilder