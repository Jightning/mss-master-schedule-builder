import {  useAppSelector } from '@/lib/hooks'
import { selectColumns, selectRows, selectSelections } from '@/lib/features/ScheduleDataSlice'
import { useEffect, useRef } from 'react'

// BUG Importing odd/even, replacing even with a selection, then ctrl+z the change is ignored
// Rows on the right side of the table (teacher rows)
const Export = (props: { setIsExportOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const exportRef = useRef<HTMLDivElement>(null)
    const rows = useAppSelector(selectRows)
    const columns = useAppSelector(selectColumns)
    const selections = useAppSelector(selectSelections)

    useEffect(() => {
        // To close the filter dropdown when the user clicks outside of it
        const handleClickOutside = (event: any) => {
            const export_btn = document.getElementById("export-btn")
            if (exportRef.current 
                && !exportRef.current.contains(event.target) 
                && event.target !== export_btn 
                && !export_btn?.contains(event.target)) {
    
                props.setIsExportOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);   

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const exportCSV = () => {
        const header = "," + columns.map((col) => col.name).toString();

        const setRows = rows.map(row => {
            let selections = columns.map(col => {
                return row.columns[col.id] ? row.columns[col.id].name : '';
            }).join(',');
            return row.name + "," + selections
        }).join('\n');

        const oddEvenRow = "oddeven," + columns.map((col) => col.oddEven).toString()

        const table = header + "\n" + setRows + "\n" + oddEvenRow;
        const blob: Blob = new Blob([table], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'schedule_data.csv');
    
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    const exportJSON = () => {
        const obj = {rows: rows, 
                     columns: columns, 
                     selections: selections};
        const json = JSON.stringify(obj);
        const blob = new Blob([json], { type: 'text/json' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'schedule_data.json');
    
        document.body.appendChild(link);
        link.click();  
        document.body.removeChild(link);
    }

    return (
        <div className="export-container" ref={exportRef}>
            <div onClick={exportCSV}>Export to CSV</div>
            <div onClick={exportJSON}>Export to JSON</div>
        </div>
    )
}

export const ExportOneDataByCSV = (props: {headerArray: Array<string>, data: any, name: string}) => {
    function exportByCSV() {
        const header = props.headerArray.map((head: string) => head).toString()

        const setData = props.data.map((el: any) => {
            return props.headerArray.map(head => {
                return el[head].toString();
            }).join(',');
        }).join('\n');

        const table = header + "\n" + setData;
        const blob: Blob = new Blob([table], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `${props.name}.csv`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div onClick={exportByCSV}>Export to CSV</div>
    )
}

export default Export