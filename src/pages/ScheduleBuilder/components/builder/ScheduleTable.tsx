import { useEffect } from 'react'
import React from 'react'
import Column from './Column'
import { 
    Row, 
    Column as ColumnInterface,
    ActiveSelectionInterface
} from '@/types'


const ScheduleTable = (props: {
    columns: Array<ColumnInterface>, 
    rows: Array<Row>, 
    heights: Array<number>,
    setRows: React.Dispatch<React.SetStateAction<Array<Row>>>,
    activeSelection: ActiveSelectionInterface | null,
    setColumns: React.Dispatch<React.SetStateAction<Array<ColumnInterface>>>,
    isOddEvenAutoAssign: boolean,
    assignOddEven: any
}) => {
    const removeEvenOdd = (columnId: ColumnInterface["id"]) => {
        let type = columnId.toString().substring(columnId.toString().length - 3, columnId.toString().length)
        if (type === "odd") {
            columnId = columnId.toString().substring(0, columnId.toString().length - 4)
        } else if (type === "ven") {
            columnId = columnId.toString().substring(0, columnId.toString().length - 5)
        }

        for (let i = 0; i < props.rows.length; i++) {
            if (props.rows[i].columns[columnId + '-odd'].id !== props.rows[i].columns[columnId + '-even'].id) {
                return
            } else {
                props.rows[i].columns[columnId] = props.rows[i].columns[columnId + '-odd']
            }
        }
    
        props.setColumns((prevColumns: Array<ColumnInterface>) => {
            for (let i = 0; i < prevColumns.length; i++) {
                if (prevColumns[i].id == columnId  + "-odd") {
                    if (!prevColumns[i].oddEven) break;
                    prevColumns.splice(i + 1, 1)
                    prevColumns[i] = {...prevColumns[i], id: prevColumns[i].id.toString().substring(0, prevColumns[i].id.toString().length - 4), name: prevColumns[i].name.substring(0, prevColumns[i].name.length - 4), oddEven: false};
                    
                    break;
                }
            }

            return prevColumns
        })
    }

    const handleDoubleClick = (e: any) => {
        let index = e.target.id.substring(14, e.target.id.length)
        let column = props.columns[index]
        let id = column.id

        if (!props.isOddEvenAutoAssign) {
            return
        }

        if (props.columns[index].oddEven) {
            removeEvenOdd(id)
        } else {
            props.assignOddEven(id)
        }

        props.setRows((prevRows) => ([...prevRows]))

    }

    
    
    return (
        <div className="schedule-table-container">
            <div className='schedule-table-headers' >
                {props.columns && props.columns.map((column: ColumnInterface, index: number) => (
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
                {props.columns && props.columns.map((column: ColumnInterface) => (
                    <div key={column.id} className='column-container'>  
                        <Column 
                            activeSelection={props.activeSelection} 
                            column={column} 
                            rows={props.rows} 
                            heights={props.heights}
                            setRows={props.setRows} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ScheduleTable