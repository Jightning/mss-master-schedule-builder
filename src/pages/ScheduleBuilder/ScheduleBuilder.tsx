import React, { useState, useEffect, ReactNode } from 'react'
import "./ScheduleBuilder.css"
import { 
    DndContext,
    DragOverlay,
    rectIntersection
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
    Row,
    ActiveSelectionInterface,
    Tile
} from '@/types'
import Settings from './components/toolbar/Settings';

import Popup from '../../components/Popup';
import Trash from './components/builder/Trash';
import Cover from './components/builder/Cover';

import { newRows, newColumns, newSelections } from '@/lib/features/ScheduleDataSlice';
import { useAppDispatch } from '@/lib/hooks';
import { selectRows, selectColumns, selectSelections } from '@/lib/features/ScheduleDataSlice';
import { useAppSelector } from '@/lib/hooks';

// TODO Possibly introduce a memo system (useMemo)

const ScheduleBuilder = () => {
    let dispatch = useAppDispatch()

    // const [rows, setRows] = useState<Array<Row>>([
    //     { name: "A. Teacher", subject: "math", id: 10394, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
    //     { name: "B. Teacher", subject: "math", id: 10324, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
    //     { name: "C. Teacher", subject: "math", id: 10395, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
    //     { name: "D. Teacher", subject: "math", id: 10396, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
    //     { name: "E. Teacher", subject: "math", id: 10397, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
    //     { name: "F. Teacher", subject: "math", id: 10398, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
    //     { name: "G. Teacher", subject: "math", id: 10399, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
    //     { name: "H. Teacher", subject: "math", id: 10320, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
    //     { name: "I. Teacher", subject: "math", id: 10349, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
    // ]);

    const rows = useAppSelector(selectRows)
    const setRows: any = (val: Array<Row>) => dispatch(newRows(val))
    

    const [columns, setColumns] = useState<Array<Column>>([
        { name: "Period 1", id: "period_1", oddEven: false, subcolumns: [{name: "Odd", id:"period_1_odd"}, {name: "Even", id:"period_1_even"}] },
        { name: "Period 2", id: "period_2", oddEven: false, subcolumns: [{name: "Odd", id:"period_2_odd"}, {name: "Even", id:"period_2_even"}] },
        { name: "Period 3", id: "period_3", oddEven: false, subcolumns: [{name: "Odd", id:"period_3_odd"}, {name: "Even", id:"period_3_even"}] },
        { name: "Period 4", id: "period_4", oddEven: false, subcolumns: [{name: "Odd", id:"period_4_odd"}, {name: "Even", id:"period_4_even"}] },
        { name: "Period 5", id: "period_5", oddEven: false, subcolumns: [{name: "Odd", id:"period_5_odd"}, {name: "Even", id:"period_5_even"}] },
        { name: "Period 6", id: "period_6", oddEven: false, subcolumns: [{name: "Odd", id:"period_6_odd"}, {name: "Even", id:"period_6_even"}] },
        { name: "Period 7", id: "period_7", oddEven: false, subcolumns: [{name: "Odd", id:"period_7_odd"}, {name: "Even", id:"period_7_even"}] },
        { name: "Period 8", id: "period_8", oddEven: false, subcolumns: [{name: "Odd", id:"period_8_odd"}, {name: "Even", id:"period_8_even"}] },
        { name: "Period 9", id: "period_9", oddEven: false, subcolumns: [{name: "Odd", id:"period_9_odd"}, {name: "Even", id:"period_9_even"}] }
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
        { name: "A", id: 130039239 },
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

    const [activeSelection, setActiveSelection] = useState<ActiveSelectionInterface | null>(null);
    const [heights, setHeights] = useState<Array<number>>([])
    const [originalRowHeights, setOriginalRowHeights] = useState<Array<number>>([])

    const [openPopup, setOpenPopup] = useState<null | ReactNode>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [autoScroll, setAutoScroll] = useState(true)

    const [isOddEvenAutoAssign, setIsOddEvenAutoAssign] = useState(true)

    // To check for window resize
    const [windowDims, setWindowDims] = useState<number[]>([window.innerWidth, window.innerHeight])
    useEffect(() => {
        function changeDims() {
            setWindowDims([window.innerWidth, window.innerHeight])
        }
        window.addEventListener('resize', changeDims)

        return () => {
            window.removeEventListener('resize', changeDims)
        }
    }, [])

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
                // Checks if the user is hovering with a selection over this row
                // if they are, only add the tallest height, since we dont want to be switching between large and small with the smaller selection
                if (index == activeSelection?.currentRowIndex) {
                    allHeights.push(height > heights[index] ? (height ? height : 0) : heights[index])
                } else {
                    // otherwise, just push normally if height exists
                    allHeights.push((height ? height : 0))
                }
            })  

            setHeights(allHeights)
        }
    }, [rows, originalRowHeights, windowDims])

    // use -1 and null for the last two parameters 
    // Coresponding row is found via the id
    const assignOddEven = (columnId: Column["id"], rowIndex?: Row["id"], evenSelection?: Tile) => {
        // insert_oddeven_row({columnId, rowIndex, evenSelection})

        setRows((() => {
            let tempRows: Array<Row> = [...rows.map((row, i) => {
                return {
                    ...row, 
                     columns: {
                        ...row.columns,
                        [columnId]: row.columns[columnId],
                        [columnId + '-odd']: row.columns[columnId],
                        [columnId + '-even']: (evenSelection && i == rowIndex) ? evenSelection : row.columns[columnId]
                    }
            }})]
            
            return [...tempRows]
        })())

        setColumns((prevColumns: Array<Column>) => {
            for (let i = 0; i < prevColumns.length; i++) {
                if (prevColumns[i].id == columnId) {
                    if (prevColumns[i].oddEven) break;

                    prevColumns.splice(i + 1, 0, {...prevColumns[i], id: prevColumns[i].id + '-even', name: prevColumns[i].name + ' Even', oddEven: true});
                    prevColumns[i] = {...prevColumns[i], id: prevColumns[i].id + '-odd', name: prevColumns[i].name + ' Odd', oddEven: true};
                    
                    break;
                }
            }

            return prevColumns
        })

    }

    const handleDragStart = (draggable: any) => {
        if (draggable.active) {
            // So the overlay gets shown
            setActiveSelection({selection: draggable.active.data.current.selection, currentRowIndex: null})

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

        // Revaluating row heights in case we return before being able to do so
        setRows([...rows])

        setAutoScroll(true)

        // hide overlay
        setActiveSelection(null)

        if (!draggable) {
            return
        }

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

            setRows((() => {
                // check below for details on these
                const toChange = draggable.data.current.rowIndex;
                const columnId = draggable.data.current.columnId
                let row = {...rows[toChange]}

                // row.columns[columnId] is the selection to change
                // setting selection of respective row in respective column to none selection
                // row.columns[columnId] = { name: "none", id: 0 }  
                row = {
                    ...row,
                    columns: {
                        [columnId]: { name: "none", id: 0 }  
                    }
                }

                return [...rows.slice(0, toChange), 
                        row, 
                        ...rows.slice(toChange + 1)]
            })())

            return
        }

        // Need row index, column id
        // Identifying index of the column to change
        const toChange = droppable.data.current.rowIndex;
        // Id of selection to change
        const columnId = droppable.data.current.columnId

        // find the current column and check if it's oddEven
        let oddEven;
        for (let col of columns) {
            if (col.id === columnId) {
                oddEven = col.oddEven
                break;
            }
        }

        if (isOddEvenAutoAssign && rows[toChange].columns[columnId].id !== 0 && oddEven === false) {
            assignOddEven(columnId, toChange, draggable.data.current.selection)
            return
        }

        setRows((() => {
            // pass by value -> cannot return reference, otherwise values will not rerender correctly
            // Row object to change
            let row = {...rows[toChange], columns: {...rows[toChange].columns, [columnId]: draggable.data.current.selection }}

            // row.columns[columnId] is the selection to change
            // setting selection of respective row in respective column to new draggable selection
            // row.columns[columnId] = draggable.data.current.selection

            return [...rows.slice(0, toChange), 
                row, 
                ...rows.slice(toChange + 1)];
        })())

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
            setRows([...rows])
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

            if (trash.length > 0) {
                // The trash is intersecting, return early
                return trash;
            } else {
                // Otherwise, we're intersecting with the cover, return the cover to ignore the selection
                const coverDroppable: any = rectIntersectionCollisions.filter(({id}: {id: SelectionInterface["id"]}) => id.toString().substring(0, 15) === 'cover-droppable')
                for (let cover of coverDroppable) {
                    if (cover.data && pointerCoordinates.x <= cover.data.droppableContainer.rect.current.right && pointerCoordinates.x >= cover.data.droppableContainer.rect.current.left) {
                        return coverDroppable
                    }
                }
            }   
        }

        // default return for a droppable -> collision algo
        const closest = rectIntersection({
            ...args,
            droppableRects: droppableRects,
            droppableContainers: droppableContainers.filter(({id}: {id: SelectionInterface["id"]}) => id !== 'trash-droppable' && id.toString().substring(0, 15) !== 'cover-droppable')
        })
        
        // store index of row over to update height -> if over row, then only update height if its taller than the heights[index]
        // To keep the height when dragging at either the original (before hover over) or the taller draggable shadow
        // FIX/somehow don't use this while still updating the value for heights
        setActiveSelection((prevActiveSelection: ActiveSelectionInterface | null) => {
            if (closest[0]?.data && closest[0].data.droppableContainer.data && prevActiveSelection)
                prevActiveSelection["currentRowIndex"] = closest[0].data.droppableContainer.data.current.rowIndex
            
            return prevActiveSelection
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
                        <h1 className="title">Master Schedule Builder</h1>
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
                        <Rows 
                            heights={heights} 
                            rowsName={rowsName}
                            activeSelection={activeSelection}  />
                        <ScheduleTable 
                            activeSelection={activeSelection} 
                            heights={heights}
                            columns={columns} 
                            isOddEvenAutoAssign={isOddEvenAutoAssign}
                            setColumns={setColumns}
                            assignOddEven={assignOddEven}
                             />
                    </div> 
                </div>

                <div className="selections-container">
                    <div className="selection-header">
                        <h4>{selectionsName}</h4>
                    </div>
                    <SelectionColumn selections={selections} />
                </div>

                {/* To allow the selection to drag over its current div
                    Overlay is what is shown when dragging */}
                <DragOverlay dropAnimation={null} modifiers={[restrictToWindowEdges]}>
                    {activeSelection ? (
                        <Selection 
                                   selectionId={activeSelection.selection.id}
                                   selection={activeSelection.selection}
                                   classNames={"selection-overlay"} />
                    ): null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default ScheduleBuilder