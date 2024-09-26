import { useEffect } from 'react'
import React from 'react'
import Column from './Column'
import { 
    Row, 
    Column as ColumnInterface,
    ActiveSelectionInterface
} from '@/types'

import { newRows, newColumns, newSelections } from '@/lib/features/ScheduleDataSlice';
import { useAppDispatch } from '@/lib/hooks';
import { selectRows, selectColumns, selectSelections } from '@/lib/features/ScheduleDataSlice';
import { useAppSelector } from '@/lib/hooks';


const ScheduleTable = (props: {
    heights: Array<number>,
    activeSelection: ActiveSelectionInterface | null,
    isOddEvenAutoAssign: boolean,
    assignOddEven: any
}) => {
    let dispatch = useAppDispatch()

    const rows = useAppSelector(selectRows)
    const setRows: any = (val: Array<Row>) => Array(dispatch(newRows(val)))

    const columns = useAppSelector(selectColumns)
    const setColumns: any = (val: Array<Row>) => dispatch(newColumns(val))
    

    const removeEvenOdd = (columnId: ColumnInterface["id"]) => {
        let type = columnId.toString().substring(columnId.toString().length - 3, columnId.toString().length)
        if (type === "odd") {
            columnId = columnId.toString().substring(0, columnId.toString().length - 4)
        } else if (type === "ven") {
            columnId = columnId.toString().substring(0, columnId.toString().length - 5)
        }

        // Removing evenodd from each row in that specific column
        let tempRows = [...rows]

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].columns[columnId + '-odd'].id !== rows[i].columns[columnId + '-even'].id) {
                // Missmatched even odd -> early termination to ensure data isn't erased by mistake
                return
            } else {
                tempRows = [
                    ...(tempRows.slice(0, i)),
                    {
                        ...tempRows[i],
                        columns: {
                            ...tempRows[i].columns,
                            [columnId]: tempRows[i].columns[columnId + '-odd']
                        }
                    },
                    ...(tempRows.slice(i+1, tempRows.length))
                ]
            }
        }

        setRows(tempRows)

        setColumns((() => {
            let tempColumns = [...columns]
            for (let i = 0; i < tempColumns.length; i++) {
                if (tempColumns[i].id == columnId  + "-odd") {
                    if (!tempColumns[i].oddEven) break;
                    tempColumns.splice(i + 1, 1)
                    tempColumns[i] = {...tempColumns[i], id: tempColumns[i].id.toString().substring(0, tempColumns[i].id.toString().length - 4), name: tempColumns[i].name.substring(0, tempColumns[i].name.length - 4), oddEven: false};
                    
                    break;
                }
            }
            return tempColumns
        })())
    }

    const handleDoubleClick = (e: any) => {
        let index = e.target.id.substring(14, e.target.id.length)
        let column = columns[index]
        let id = column.id

        if (!props.isOddEvenAutoAssign) {
            return
        }

        if (columns[index].oddEven) {
            removeEvenOdd(id)
        } else {
            props.assignOddEven(id)
        }

    }

    
    
    return (
        <div className="schedule-table-container">
            <div className='schedule-table-headers' >
                {columns && columns.map((column: ColumnInterface, index: number) => (
                    <div 
                    key={column.id} 
                    className='column-header' 
                    onDoubleClick={handleDoubleClick}
                    id={"column-header-" + index}
                    style={{
                        borderRight: column.oddEven && column.name.includes("Even") ? "solid" : "none",
                        borderLeft: column.oddEven && column.name.includes("Odd") ? "solid" : "none",
                        borderWidth: "1px"
                    }}>
                        {column.name}
                    </div>
                ))}
            </div>

            <div className='schedule-table-columns'>
                {columns && columns.map((column: ColumnInterface) => (
                    <div key={column.id} className='column-container'>  
                        <Column 
                            activeSelection={props.activeSelection} 
                            column={column}
                            heights={props.heights} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ScheduleTable