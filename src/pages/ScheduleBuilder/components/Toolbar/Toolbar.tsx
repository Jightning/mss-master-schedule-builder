import React from 'react'
import Import from './Import'
import Export from './Export'
import { 
    Row, 
    Column,
    Selection as SelectionInterface 
} from '../../types'


// Rows on the right side of the table (teacher rows)
const Toolbar = (props: {
    rows: Array<Row>,
    setRows: any,
    columns: Array<Column>,
    setColumns: any,
    selections: Array<SelectionInterface>,
    setSelections: any
}) => {
    return (
    <div className="toolbar">
        <ul>
            <Import setRows={props.setRows}
                    setColumns={props.setColumns}
                    setSelections={props.setSelections} />
            <Export rows={props.rows}
                    columns={props.columns}
                    selections={props.selections} />
            <span/><span/>
            <li className='search-box'>Search</li>
            <li className='settings'>Settings</li>
        </ul>
    </div>
)
}

export default Toolbar