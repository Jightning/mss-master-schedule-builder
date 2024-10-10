import { ActiveSelectionInterface } from '@/types'

import { selectRows, selectSettings, selectFilter } from '@/lib/features/ScheduleDataSlice';
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
    const settings = useAppSelector(selectSettings)

    return (
        <div className='rows-container' key={1}>
            <div className={"rows-header"}>{props.rowsName}</div>
            {rows && rows.map((row: Record<string, any>, index: number) => (

                (filter.rows.searchTerm === "" || (row.name.trim().toLowerCase()).includes(filter.rows.searchTerm.trim().toLowerCase()))
                && 
                (filter.rows.subjects.length === 0 || filter.rows.subjects.includes(row.subject)) ?

                <div className={"single-row-container"} 
                    key={row.id}
                    id={"row-" + row.id}
                    style={{
                        height: `${props.heights[index]}px`,
                        // color: props.activeSelection?.currentRowIndex == index ? "blue" : "black"
                        color: settings.isColorRowSubjects ? settings.colors[row.subject] : "black"
                    }}>
                        <p>{row.name}</p>
                </div> : <></>
            ))}
        </div>
    )
}

export default Rows