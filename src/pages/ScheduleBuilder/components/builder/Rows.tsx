import { ActiveSelectionInterface, Row } from '@/types'

import { selectRows, selectSettings, selectFilter, selectSubjects } from '@/lib/features/ScheduleDataSlice';
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
    const subjects = useAppSelector(selectSubjects)

    const subjectsObject = subjects.reduce((acc: any, item) => {
        acc[item.name] = item.color
        return acc
    }, {})


    return (
        <div className='rows-container' key={1}>
            <div className={"rows-header"}>
                {rows.length >= 1 
                ? <p>{props.rowsName}</p>
                : <p>No Rows Found</p>}
            </div>

            {rows && rows.map((row: Row, index: number) => {
                const { show } = useContextMenu({
                    id: "row-header-" + row.id
                });

                const displayMenu = (e: any) => {
                    show({
                        event: e
                    });
                }

                const isSubjectNone = !subjects.some((subject) => subject.name === row.subject)
                
                return (                    
                    (filter.rows.searchTerm === "" || (row.name.trim().toLowerCase()).includes(filter.rows.searchTerm.trim().toLowerCase()))
                    && 
                    (filter.rows.subjects.length === 0 || filter.rows.subjects.includes(row.subject) || isSubjectNone) ?
                    
                    <div className={"single-row-container"} 
                        id={"row-" + row.id}
                        key={row.id}
                        style={{
                            height: `${props.heights[index]}px`,
                            color: props.activeSelection?.currentRowIndex == index ? "blue" : (settings.isColorRowSubjects ? subjectsObject[row.subject] : "black")
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