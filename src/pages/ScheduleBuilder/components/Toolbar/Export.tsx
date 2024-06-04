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
        const csv = "1,2,3,4,5,5\n2,3,4,5,6,7\n3,3,2,2,3,4"
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

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