import React, { useRef, useState } from 'react'
import Papa from 'papaparse'
import { 
    Row, 
    Column,
    Selection as SelectionInterface 
} from '../../types'


// Rows on the right side of the table (teacher rows)
const Import = (props: {
    setRows: any,
    setColumns: any,
    setSelections: any,
}) => {
    const inputCSVFile = useRef<HTMLInputElement>(null);
    const inputJSONFile = useRef<HTMLInputElement>(null);

    const clickCSV = () => inputCSVFile.current!.click();
    const clickJSON = () => inputJSONFile.current!.click();

    const [dropdown, setDropdown] = useState(false);

    const toggleDropdown = () => setDropdown(!dropdown);
    const deactivateDropdown = () => setDropdown(false);
    
    const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== 'text/csv') {
            console.error("Invalid file type.");
            return;
        }
        
        Papa.parse(file, {
            header: true,
            dynamicTyping: false,
            complete: (results: any) => {
                try {
                    const columnNames = results.meta.fields.slice(1);
                    props.setColumns(columnNames.map((x: any, i: any) => { return {name: x, id: i}; }));

                    // TODO: maybe handle nones and make them always have id = 0
                    const selections = [...new Set(results.data.map((row: any) => Object.values(row).slice(1)).flat())].map((x: any, i: any) => { return {name: x, id: i}; });
                    props.setSelections(selections);
                    
                    const selectionsDict = selections.reduce((acc: any, current: any) => { acc[current.name] = current; return acc; }, {});
                    const rows = results.data.map((row: any, i: any) => { return { name: row[""], subject: "none", id: i, columns: columnNames.reduce((acc: any, name: any, j: any) => { acc[j] = selectionsDict[row[name]]; return acc; }, {}) }; }); // hehehehe peak coding
                    props.setRows(rows);
                } catch (error) {
                    console.error("Invalid CSV format");
                }
            },
            error: (error) => {
                console.error("Error parsing CSV:", error);
            },
        });
    }
    
    const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== 'application/json') {
            console.error("Invalid file type.");
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target && typeof ev.target.result === 'string') {
                try {
                    const json = JSON.parse(ev.target.result);

                    if (json.rows && json.columns && json.selections){
                        props.setRows(json.rows);
                        props.setColumns(json.columns);
                        props.setSelections(json.selections);
                    } else {
                        console.error("Invalid JSON format");
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            }
        }
        reader.readAsText(file);
    }
    
    return (
        <li className="export-btn" onMouseLeave={deactivateDropdown}>
        <div onClick={toggleDropdown}>Import</div>
        {dropdown && (
        <div className="dropdown-content">
            <div onClick={clickCSV}>
                Import from CSV
                <input
                    style={{ display: "none" }}
                    accept=".csv"
                    ref={inputCSVFile}  
                    onChange={importCSV}
                    type="file"
                />
            </div>
            <div onClick={clickJSON}>
                Import from JSON
                <input
                    style={{ display: "none" }}
                    accept=".json"
                    ref={inputJSONFile}
                    onChange={importJSON}
                    type="file"
                />
            </div>
        </div>
        )}
    </li>
)
}

export default Import