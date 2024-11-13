import React, { useState, useEffect, ReactNode, useRef } from 'react'

import "./ScheduleBuilder.css"

import { 
    DndContext,
    DragOverlay,
    rectIntersection
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

import { useDraggable as useDraggableScroll } from "react-use-draggable-scroll";


import Rows from './components/builder/Rows'
import ScheduleTable from './components/builder/ScheduleTable'
import SelectionColumn from './components/builder/SelectionColumn'
import Selection from './components/builder/Selection'
import { 
    Selection as SelectionInterface, 
    Column, 
    Row,
    ActiveSelectionInterface,
    ScheduleBuilderAction
} from '@/types'
import Settings from './components/toolbar/Settings';

import Popup from '../../components/Popup';
import Trash from './components/toolbar/Trash';
import Cover from './components/builder/Cover';
import Filter from './components/toolbar/Filter';
import SearchBar from './components/toolbar/SearchBar';
import UndoRedo from './components/toolbar/UndoRedo';

import { newRows, newColumns, newFilter, selectSettings, newSettings } from '@/lib/features/ScheduleDataSlice';
import { useAppDispatch } from '@/lib/hooks';
import { selectRows, selectColumns, selectFilter } from '@/lib/features/ScheduleDataSlice';
import { useAppSelector } from '@/lib/hooks';

import { addState } from '@/lib/features/ScheduleDataSlice';

// TODO Possibly introduce a memo system (useMemo or useCallback)

const ScheduleBuilder = () => {
    // Redux state management
    let dispatch = useAppDispatch()

    const rows = useAppSelector(selectRows)
    const setRows: any = (val: Array<Row>) => dispatch(newRows(val))

    const columns = useAppSelector(selectColumns)
    const setColumns: any = (val: Array<Column>) => dispatch(newColumns(val))

    const filter = useAppSelector(selectFilter)
    const setFilter: any = (val: object) => dispatch(newFilter(val))

    const settings = useAppSelector(selectSettings)
    const setSettings: any = (val: object) => dispatch(newSettings(val))

    const addHistoryState: any = (val: ScheduleBuilderAction) => dispatch(addState(val))

    // \Redux\

    const [rowsName, setRowsName] = useState("Teachers")
    const [selectionsName, setSelectionsName] = useState("Classes")

    const [activeSelection, setActiveSelection] = useState<ActiveSelectionInterface | null>(null);
    const [heights, setHeights] = useState<Array<number>>([])
    const [originalRowHeights, setOriginalRowHeights] = useState<Array<number>>([])

    const [openPopup, setOpenPopup] = useState<null | ReactNode>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [autoScroll, setAutoScroll] = useState(true)

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)


    // To check for window resize
    const [windowDims, setWindowDims] = useState<number[]>([window.innerWidth, window.innerHeight])
    useEffect(() => {
        function changeDims() {
            setWindowDims([window.innerWidth, window.innerHeight])
            
        }
        function selectSearch(event: any) {
            const input = document.getElementById('search-input');
            if (!input) {
                return
            }

            if (event.key === '/') {
                event.preventDefault()
                input.focus();
            } else if (event.key === 'Escape') {
                event.preventDefault()
                input.blur();
            }
        }

        window.addEventListener('resize', changeDims)
        document.addEventListener('keydown', selectSearch)

        return () => {
            window.removeEventListener('resize', changeDims)
            document.removeEventListener('keydown', selectSearch)
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
                // minimum height is 70, otherwise we add 11 to account for padding
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
                // if they are, only add the tallest height, since we don't want to be switching between large and small with the smaller selection
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

            addHistoryState({type: "DELETE_SIMPLE_ROW", 
                            action: {
                                columnId: draggable.data.current.columnId, 
                                toChange: draggable.data.current.rowIndex,
                                selection: draggable.data.current.selection
                            }})
            return
        }

        // Need row index, column id
        // Identifying index of the column to change
        const toChange = droppable.data.current.rowIndex;
        console.log(toChange)
        // Id of selection to change
        const columnId = droppable.data.current.columnId

        // find the current column and check if it's oddEven
        let oddEven = columns[columns.findIndex(column => columnId === column.id)].oddEven
        
        if (settings.isOddEvenAutoAssign && rows[toChange].columns[columnId].id !== 0 && !oddEven && settings.isOddEvenToggle) {
            // assignOddEven(columnId, toChange, draggable.data.current.selection)
            addHistoryState({type: "PATCH_EVEN_ODD", action: {columnId, toChange, selection: draggable.data.current.selection}})
            
            if (draggable.data.current.rowIndex !== toChange && draggable.data.current.columnId !== columnId) {
                addHistoryState({type: "PATCH_SIMPLE_ROW", action: {
                    selection: draggable.data.current.selection, 
                    toChange: toChange, columnId: columnId + "-odd",
                    prevToChange: draggable.data.current.rowIndex,
                    prevColumnId: draggable.data.current.columnId
                }})
            }

            return
        }
        
        // Sets the row for regular situations
        addHistoryState({type: "PATCH_SIMPLE_ROW", action: {
            selection: draggable.data.current.selection, 
            toChange, columnId,
            prevToChange: draggable.data.current.rowIndex,
            prevColumnId: draggable.data.current.columnId
        }})

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
                        {/* BUG Currently disabled due to bug
                                When dragging something over, it occasionally does not delete
                                Quickly dragging the same selection over again does delete it
                                Replicable by splitting a column to odd/even with a selection inside, and then dragging the odd version to the trash bin */}
                        {/* <Trash /> */}
                    </div>

                    <UndoRedo />

                    {isFilterOpen ? <Filter setIsFilterOpen={setIsFilterOpen} rowsName={rowsName} selectionsName={selectionsName} /> : <></>}
                    {isSettingsOpen ? <Settings setIsSettingsOpen={setIsSettingsOpen} rowsName={rowsName} selectionsName={selectionsName} /> : <></>}

                    <div className="toolbar">
                        <ul>
                            <li className='import-btn rounded-tl-md rounded-bl-md'>Import</li>
                            <li className='export-btn rounded-tr-md rounded-br-md'>Export</li>
                            <span/>
                            <li className='search-box rounded-tl-md rounded-bl-md'><SearchBar searchLocation="rows" /></li>
                            <span/>

                            <li className='filter-btn rounded-md' id="filter-btn" onClick={() => setIsFilterOpen((prevIsFilterOpen) => {
                                if (isSettingsOpen) {
                                    setIsSettingsOpen(false)
                                }
                                return !prevIsFilterOpen
                            })}>
                                <svg className="filter-svg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"/></svg>
                            </li>
                    
                            <li className='settings-btn rounded-md' id="settings-btn" onClick={() => setIsSettingsOpen((prevIsSettingsOpen) => {
                                if (isFilterOpen) {
                                    setIsFilterOpen(false)
                                }
                                return !prevIsSettingsOpen
                            })}>
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
                             />
                    </div> 
                </div>

                <div className="selections-container">
                    <div className="selection-header">
                        <h4>{selectionsName}</h4>
                    </div>
                    <div className='selection-search search-box rounded-tr-md rounded-br-md'>
                        <SearchBar searchLocation='selections'/>
                    </div>
                    <SelectionColumn />
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