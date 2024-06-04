import React from 'react'
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
    
    const exportCSV = () => {
        const header = "," + props.columns.map((it) => it.name).toString();
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
    
    return (
    <li className="export-btn" onClick={exportCSV}>Export</li>
)
}

export default Export