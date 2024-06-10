import React, { useState } from 'react'
import { 
    Row, 
    Column,
    Selection as SelectionInterface 
} from '../../types'


// Rows on the right side of the table (teacher rows)
const Export = (props: {
    rows: Array<Row>,
    columns: Array<Column>,
    selections: Array<SelectionInterface>,
}) => {

    const [dropdown, setDropdown] = useState(false);

    const toggleDropdown = () => setDropdown(!dropdown);
    const deactivateDropdown = () => setDropdown(false);
    
    const exportCSV = () => {
        const header = "," + props.columns.map((it) => it.name).toString();
        // TODO: order is not guaranteed, should use order of props.columns to determine orders of items in rows
        const rows = props.rows.map((it) => it.name + "," + Object.values(it.columns).map((x) => x.name).toString()).join("\n");
        const table = header + "\n" + rows;
        const blob = new Blob([table], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'data.csv');
    
        document.body.appendChild(link);
        link.click();
    
        document.body.removeChild(link);
        console.log("hello");
    }
    
    const exportJSON = () => {
        const obj = {rows: props.rows, 
                     columns: props.columns, 
                     selections: props.selections};
        const json = JSON.stringify(obj);
        const blob = new Blob([json], { type: 'text/json' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'data.json');
    
        document.body.appendChild(link);
        link.click();
    
        document.body.removeChild(link);
        console.log("hello");

    }

    return (
    <li className="export-btn" onMouseLeave={deactivateDropdown}>
        <div onClick={toggleDropdown}>Export</div>
        {dropdown && (
        <div className="dropdown-content">
            <div onClick={exportCSV}>Export to CSV</div>
            <div onClick={exportJSON}>Export to JSON</div>
        </div>
        )}
    </li>
)
}

export default Export