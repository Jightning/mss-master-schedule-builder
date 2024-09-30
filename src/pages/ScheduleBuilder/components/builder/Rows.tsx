import { Row, ActiveSelectionInterface } from '@/types'

import { newSelections } from '@/lib/features/ScheduleDataSlice';
import { selectRows, selectSelections, selectFilter, selectSearchTerm } from '@/lib/features/ScheduleDataSlice';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';

// Rows on the right side of the table (teacher rows)

const Rows = (
    props: {   
        heights: Array<number>, 
        rowsName: string, 
        activeSelection: ActiveSelectionInterface | null
    }) => {

    const rows = useAppSelector(selectRows)

    const filter = useAppSelector(selectFilter)
    const searchTerm = useAppSelector(selectSearchTerm)

    return (
        <div className='rows-container' key={1}>
            <div className={"rows-header"}>{props.rowsName}</div>
            {rows && rows.map((row: Record<string, any>, index: number) => (

                searchTerm === "" || (filter.searchLocation === "rows" && (row.name.trim().toLowerCase()).includes(searchTerm.trim().toLowerCase()))
                || filter.searchLocation !== "rows" ?

                <div className={"single-row-container"} 
                    key={row.id}
                    id={"row-" + row.id}
                    style={{
                        height: `${props.heights[index]}px`,
                        color: props.activeSelection?.currentRowIndex == index ? "blue" : "black"
                    }}>

                        <p>{row.name}</p>

                </div> : <></>
            ))}
        </div>
    )
}

export default Rows