import React, { useRef, useState } from 'react'
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
    
    const importCSV = () => {

    }
    
    const importJSON = () => {

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