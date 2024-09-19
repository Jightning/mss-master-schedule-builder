import React from 'react'
import { Row, ActiveSelectionInterface } from '@/types'
// Rows on the right side of the table (teacher rows)
const Rows = (props: {heights: Array<number>, rows: Array<Row>, rowsName: string, activeSelection: ActiveSelectionInterface | null}) => {
    return (
        <div className='rows-container'>
            <div className={"rows-header"}>{props.rowsName}</div>
            {props.rows && props.rows.map((row: Record<string, any>, index: number) => (
                <div className={"single-row-container"} 
                    key={row.id}
                    id={"row-" + row.id}
                    style={{
                        height: `${props.heights[index]}px`,
                        color: props.activeSelection?.currentRowIndex == index ? "blue" : "black"
                    }}>

                        <p>{row.name}</p>

                </div>
            ))}
        </div>
    )
}

export default Rows