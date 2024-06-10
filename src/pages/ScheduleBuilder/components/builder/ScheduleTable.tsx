import Column from './Column'
import { 
    Row, 
    Column as ColumnInterface,
    ActiveSelectionInterface
} from '../../types'

const ScheduleTable = (props: {
    columns: Array<ColumnInterface>, 
    rows: Array<Row>, 
    heights: Array<number>,
    setRows: React.Dispatch<React.SetStateAction<Array<Row>>>,
    activeSelection: ActiveSelectionInterface | null
}) => {
    
    return (
        <div className="schedule-table-container">
            <div className='schedule-table-headers' >
                {props.columns && props.columns.map((column: ColumnInterface) => (
                    <div key={column.id} className='column-header' style={{
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