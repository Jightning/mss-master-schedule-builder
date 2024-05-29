import Column from './Column'
import { 
    Row, 
    Column as ColumnInterface,
    Selection as SelectionInterface 
} from '../types'

const ScheduleTable = (props: {
    columns: Array<ColumnInterface>, 
    rows: Array<Row>, 
    heights: Array<number>,
    activeSelection: SelectionInterface | null
}) => {
    
    return (
        <div className="schedule-table-container">
            <div className='schedule-table-headers' >
                {props.columns && props.columns.map((column: ColumnInterface) => (
                    <div key={column.id} className='column-header'>
                        {column.name}
                    </div>
                ))}
            </div>

            <div className='schedule-table-columns'>
                {props.columns && props.columns.map((column: ColumnInterface) => (
                    <div key={column.id} className='column-container'>  
                        <Column activeSelection={props.activeSelection} column={column} rows={props.rows} heights={props.heights} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ScheduleTable