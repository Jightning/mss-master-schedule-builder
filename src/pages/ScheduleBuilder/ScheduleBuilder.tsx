import React, { useState, useEffect, ReactNode } from 'react'
import "./ScheduleBuilder.css"
import { 
    DndContext,
    DragOverlay,
    rectIntersection,
    closestCorners
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

import { useDraggable as useDraggableScroll } from "react-use-draggable-scroll";
import { useRef } from 'react';

import Rows from './components/builder/Rows'
import ScheduleTable from './components/builder/ScheduleTable'
import SelectionColumn from './components/builder/SelectionColumn'
import Selection from './components/builder/Selection'
import { 
    Selection as SelectionInterface, 
    Column, 
    Row 
} from './types'
import Settings from './components/toolbar/Settings';

import Popup from '../../components/Popup';
import Trash from './components/builder/Trash';
import Cover from './components/builder/Cover';

const ScheduleBuilder = () => {
    const [rows, setRows] = useState<Array<Row>>([
        { name: "A. Teacher", subject: "math", id: 10394, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "B. Teacher", subject: "math", id: 10324, columns: {"period_1": {name: "none", id: 1234 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "C. Teacher", subject: "math", id: 10395, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "D. Teacher", subject: "math", id: 10396, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "E. Teacher", subject: "math", id: 10397, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "F. Teacher", subject: "math", id: 10398, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "G. Teacher", subject: "math", id: 10399, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "H. Teacher", subject: "math", id: 10320, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "I. Teacher", subject: "math", id: 10349, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
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
        { name: "AP Physics 100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", id: 332448 },
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
    const [originalRowHeights, setOriginalRowHeights] = useState<Array<number>>([])

    const [openPopup, setOpenPopup] = useState<null | ReactNode>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [autoScroll, setAutoScroll] = useState(true)

    // Sets original heights of rows in case large elements are removed
    // Height creation function after this only adds height, when larger selection is removed, row height remains the same, causing it to be bigger than it should be
    // Row heights should be checked off original height
    useEffect(() => {   
        if (rows && rows.length > 0) {
            let rowHeights: Array<number> = []

            // Set all heights based on row height
            rows.forEach((row: Row) => {
                const rowElement = document.getElementById(`row-${row.id}`)
                const height = rowElement?.getElementsByTagName("p")[0].offsetHeight
                // Adds height
                // miniumum height is 70, otherwise we add 11 to account for padding
                rowHeights.push((height && height > 70 ? height + 11 : 70))
            })  
            setOriginalRowHeights(rowHeights)
        }
    }, [])


    // Auto Adjusts the heights of each row in the table
    // To match up the column row heights and the row column heights
    useEffect(() => {   
        if (rows && rows.length > 0 && originalRowHeights) {
            let allHeights: Array<number> = []
            // Set all heights based on row height
            rows.forEach((row: Row, index: number) => {
                let height = originalRowHeights[index];
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
    }, [rows, originalRowHeights])


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

        setAutoScroll(true)

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

        if (!droppable || droppable.id.toString().substring(0, 15) === 'cover-droppable' || droppable.disabled === true) {
            return
        } else if (droppable.id == "trash-droppable") {
            if (draggable.data.current.rowIndex === undefined || draggable.data.current.columnId == undefined) {
                return
            }

            setRows((prevRows) => {
                // Need row index, column id
                // Identifying index of the column to change
                const toChange = draggable.data.current.rowIndex;
                // Id of selection to change
                const columnId = draggable.data.current.columnId
                // pass by value -> cannot return reference, otherwise values will not rerender correctly
                // Row object to change
                let row = {...prevRows[toChange]}

                // row.columns[columnId] is the selection to change

                // setting selection of respective row in respective column to none selection
                row.columns[columnId] = {name: "none", id:0 }

                return [...prevRows.slice(0, toChange), 
                    row, 
                    ...prevRows.slice(toChange + 1)];
            })

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
    
    const handleDragMove = (draggable: {over: any, collisions: any}) => {
        if (draggable.collisions
            && draggable.collisions.length !== 0 
            && draggable.over 
            && draggable.over.id !== "trash-droppable"
            && draggable.over.id.toString().substring(0, 15) !== "cover-droppable") {
                setAutoScroll(true)
        } else {
            setAutoScroll(false)
        }
    }

    const handleCollision = ({
        droppableContainers,
        pointerCoordinates,
        droppableRects,
        ...args
    }: any) => {
        const rectIntersectionCollisions = rectIntersection({
            ...args,
            droppableRects: droppableRects,
            droppableContainers: droppableContainers.filter(({id}: {id: SelectionInterface["id"]}) => id === 'trash-droppable' || id.toString().substring(0, 15) === 'cover-droppable')
        });

        if (rectIntersectionCollisions.length > 0) {
            const trash = rectIntersectionCollisions.filter(({id}: {id: SelectionInterface["id"]}) => id === 'trash-droppable')
            console.log(trash)
            if (trash.length > 0) {
                // The trash is intersecting, return early
                return trash;
            } else {
                // Otherwise, we're intersecting with the cover, return the cover to ignore the selection
                const coverDroppable = rectIntersectionCollisions.filter(({id}: {id: SelectionInterface["id"]}) => id.toString().substring(0, 15) === 'cover-droppable')
                for (let cover of coverDroppable) {
                    if (cover.data && pointerCoordinates.x <= cover.data.droppableContainer.rect.current.right && pointerCoordinates.x >= cover.data.droppableContainer.rect.current.left) {
                        return coverDroppable
                    }
                }
            }   
        }

        // default return for a droppable -> place into closest corner 
        const closest = rectIntersection({
            ...args,
            droppableRects: droppableRects,
            droppableContainers: droppableContainers.filter(({id}: {id: SelectionInterface["id"]}) => id !== 'trash-droppable' && id.toString().substring(0, 15) !== 'cover-droppable')
        })

        return closest
    }

    // FOR DRAG SCROLL, NOT FOR DRAGGABLE
    const drag_scroll_ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
    const { events } = useDraggableScroll(drag_scroll_ref)
    
    return (
        <div id="sb-container">
            {openPopup ?    
                (<Popup closePopup={() => setOpenPopup(null)}>
                    {openPopup}
                </Popup>)
            : null}
            <DndContext onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragMove={handleDragMove}
                        modifiers={[restrictToWindowEdges]}
                        autoScroll={autoScroll}
                        collisionDetection={handleCollision}>
                <div id="main-container">
                    <div className="header">
                        <h1 className="title">Manhasset Master Schedule Builder</h1>
                        <Trash />
                    </div>
                    <div className="toolbar">
                        <ul>
                            <li className='import-btn'>Import</li>
                            <li className='export-btn'>Export</li>
                            <span/><span/>
                            <li className='search-box'>Search</li>
                            <li className='filter-btn'><svg className="filter-svg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"/></svg></li>
                            
                            <li className='settings' onClick={() => setOpenPopup(<Settings/>)}>
                                <svg className={(isAnimating ? "animating" : "")} 
                                    onMouseEnter={() => setIsAnimating(true)}
                                    onAnimationEnd={() => setIsAnimating(false)}
                                    xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                            </li>
                        </ul>
                    </div>

                    <Cover className='selections-drop-cover cover-l' id="cover-droppable-l" />
                    <Cover className='selections-drop-cover cover-r' id="cover-droppable-r" />
                    
                    <div className='schedule-container' {...(activeSelection ? null : {...events})} ref={drag_scroll_ref}>
                        <Rows heights={heights} rows={rows} rowsName={rowsName} />
                        <ScheduleTable 
                            activeSelection={activeSelection} 
                            heights={heights}
                            setRows={setRows}
                            columns={columns} 
                            rows={rows} />
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