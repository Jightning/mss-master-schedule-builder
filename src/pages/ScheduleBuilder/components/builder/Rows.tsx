import { Row, ActiveSelectionInterface } from '@/types'

import { newRows, newColumns, newSelections } from '@/lib/features/ScheduleDataSlice';
import { useAppDispatch } from '@/lib/hooks';
import { selectRows, selectColumns, selectSelections } from '@/lib/features/ScheduleDataSlice';
import { useAppSelector } from '@/lib/hooks';
// Rows on the right side of the table (teacher rows)
const Rows = (
    props: {   
        heights: Array<number>, 
        rowsName: string, 
        activeSelection: ActiveSelectionInterface | null
    }) => {

    let dispatch = useAppDispatch()

    const rows = useAppSelector(selectRows)

    return (
        <div className='rows-container'>
            <div className={"rows-header"}>{props.rowsName}</div>
            {rows && rows.map((row: Record<string, any>, index: number) => (
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