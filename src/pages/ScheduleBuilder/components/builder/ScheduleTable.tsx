import Column from './Column'
import { 
    Column as ColumnInterface,
    ActiveSelectionInterface,
    ScheduleBuilderAction,
} from '@/types'

import { useAppDispatch } from '@/lib/hooks';
import { selectColumns, selectSettings, addState } from '@/lib/features/ScheduleDataSlice';
import { useAppSelector } from '@/lib/hooks';



const ScheduleTable = (props: {
    heights: Array<number>,
    activeSelection: ActiveSelectionInterface | null,
    // assignOddEven: any
}) => {
    let dispatch = useAppDispatch()

    // const rows = useAppSelector(selectRows)
    // const setRows: any = (val: Array<Row>) => Array(dispatch(newRows(val)))

    const columns = useAppSelector(selectColumns)
    // const setColumns: any = (val: Array<ColumnInterface>) => dispatch(newColumns(val))

    // const filter = useAppSelector(selectFilter)
    // const setFilter: any = (val: string) => dispatch(newFilter(val))

    const settings = useAppSelector(selectSettings)

    const addHistoryState: any = (val: ScheduleBuilderAction) => dispatch(addState(val))

    const handleDoubleClick = (e: any) => {
        let index = e.target.id.substring(14, e.target.id.length)
        let column = columns[index]
        let id = column.id

        if (!settings.isOddEvenToggle) {
            return
        }

        if (columns[index].oddEven) {
            if (columns[index].oddEven === "ODD") {
                id = id.toString().substring(0, id.toString().length - 4)
            } else if (columns[index].oddEven === "EVEN") {
                id = id.toString().substring(0, id.toString().length - 5)
            }
            
            addHistoryState({type: "DELETE_EVEN_ODD", action: {columnId: id}})

        } else {
            addHistoryState({type: "PATCH_EVEN_ODD", action: {columnId: id}})
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