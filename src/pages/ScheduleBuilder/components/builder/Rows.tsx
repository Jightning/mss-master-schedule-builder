import React from 'react'
import { Row } from '../../types'

// Rows on the right side of the table (teacher rows)
const Rows = (props: {heights: Array<number>, rows: Array<Row>, rowsName: string}) => {
    return (
        <div className='rows-container'>
            <div className={"rows-header"}>{props.rowsName}</div>
            {props.rows && props.rows.map((row: Record<string, any>, index: number) => (
                <div className={"single-row-container"} 
                    key={row.id}
                    id={"row-" + row.id}
                    style={{
                        height: `${props.heights[index]}px`
                    }}>

                        {row.name}

                </div>
            ))}
        </div>
    )
}

export default Rows