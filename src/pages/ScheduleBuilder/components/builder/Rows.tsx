import { ActiveSelectionInterface, Row } from '@/types'

import { selectRows, selectSettings, selectFilter } from '@/lib/features/ScheduleDataSlice';
import { useAppSelector } from '@/lib/hooks';

import { useContextMenu } from "react-contexify";  
import "react-contexify/dist/ReactContexify.css";

// Rows on the right side of the table (teacher rows)

const Rows = (
    props: {   
        heights: Array<number>, 
        rowsName: string
        activeSelection: ActiveSelectionInterface | null
    }) => {

    const rows = useAppSelector(selectRows)

    const filter = useAppSelector(selectFilter)
    const settings = useAppSelector(selectSettings)

    return (
        <div className='rows-container' key={1}>
            <div className={"rows-header"}>{props.rowsName}</div>
            {rows && rows.map((row: Row, index: number) => {
                const { show } = useContextMenu({
                    id: row.id
                });

                const displayMenu = (e: any) => {
                    show({
                        event: e
                    });
                }
                
                return (                    
                    (filter.rows.searchTerm === "" || (row.name.trim().toLowerCase()).includes(filter.rows.searchTerm.trim().toLowerCase()))
                    && 
                    (filter.rows.subjects.length === 0 || filter.rows.subjects.includes(row.subject)) ?
                    
                    <div className={"single-row-container"} 
                        id={"row-" + row.id}
                        key={row.id}
                        style={{
                            height: `${props.heights[index]}px`,
                            color: props.activeSelection?.currentRowIndex == index ? "blue" : (settings.isColorRowSubjects ? settings.colors[row.subject] : "black")
                            // color: settings.isColorRowSubjects ? settings.colors[row.subject] : "black"
                        }}
                        onContextMenu={displayMenu}>
                            <p>{row.name}</p>
                    </div> : <></>
                )
            })}
        </div>
    )
}

export default Rows