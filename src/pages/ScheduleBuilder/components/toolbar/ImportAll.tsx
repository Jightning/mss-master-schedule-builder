import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Column, Row, Selection, ScheduleBuilderAction } from "@/types";
import { useRef } from "react";

import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse'
import { defaultSelection, selectionCountValue } from "@/lib/features/Utilities";

import { 
    addState,
    newColumns, 
    newRows, 
    newSelections, 
    selectRows, 
    selectSelections, 
} from '@/lib/features/ScheduleDataSlice';
import { message } from "@tauri-apps/api/dialog";

export const convertStringToBoolean = (value: string): string | boolean => {
    if (typeof value == "string") {
        if (value.toLowerCase() === 'true') {
            return true;
        } else if (value.toLowerCase() === 'false') {
            return false;
        }
    }
    return value;
}

const ImportByCSV = () => {
    const inputCSVFile = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch()
    const setColumns: any = (val: Array<Column>) => dispatch(newColumns(val))
    const setRows: any = (val: Array<Row>) => dispatch(newRows(val))
    const setSelections: any = (val: Array<Selection>) => dispatch(newSelections(val))
    const selections = useAppSelector(selectSelections)
    const prevRows = useAppSelector(selectRows)

    const clickCSV = () => inputCSVFile.current!.click();

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
                    console.log(columnNames)
                    let columnObject: any = {}
                    // Keep track of our ids to match the id of odd/even
                    let idObject: any = {}
                    setColumns(columnNames.map((x: any) => { 
                        let thisId = uuidv4()
                        // Id cannot end with odd or even
                        while (thisId.endsWith("odd") || thisId.endsWith("even")) {
                            thisId = uuidv4()
                        }

                        const oddEven = convertStringToBoolean(results.data[results.data.length - 1][x])
                        // Ensure id matches it's pairing
                        // TODO Bad -> Uses name which isn't confirmed to be always different
                        if (oddEven) {
                            const baseName = oddEven === "ODD" ? x.slice(0, -4) : x.slice(0, -5)
                            if (idObject[baseName]) {
                                thisId = idObject[baseName]
                            } else {
                                idObject[baseName] = thisId
                            }
                        }

                        columnObject[x] = {id: thisId + (oddEven === "ODD" ? "-odd" : oddEven === "EVEN" ? "-even" : ""), oddEven: oddEven}
                        return {name: x, ...columnObject[x]}; 
                    }));

                    // TODO: maybe handle nones and make them always have id = 0
                    const newSelections = [
                        ...new Set(results.data.slice(0, -1).map((row: any) => Object.values(row).slice(1)).flat().filter((x: any) => (x !== null && x!== undefined && x !== 'none' && x !== ''))
                    )].map((x: any) => {
                            return {name: x, id: uuidv4(), subject: "none"}; 
                        }
                    );

                    const selectionsDict = [...selections, ...newSelections].reduce((acc: any, current: any) => { 
                        if (!acc[current.name]) {
                            acc[current.name] = current; 
                        }
                        return acc; 
                    }, {});

                    setSelections(Object.values(selectionsDict));
                    const rows = results.data.slice(0, -1).map((row: any) => { 
                        let count = 0;
                        const col = columnNames.reduce((acc: any, name: any) => { 
                            if (selectionsDict[row[name]] === undefined) {
                                acc[columnObject[name].id] = {...defaultSelection, oddEven: false}
                            } else {
                                count += convertStringToBoolean(columnObject[name].oddEven) ? selectionCountValue/2 : selectionCountValue
                                acc[columnObject[name].id] = selectionsDict[row[name]]; 
                            }
        
                            return acc; 
                        }, {})

                        // TODO dependent on name
                        const prevRowIndex = prevRows.findIndex((prevRow: Row) => prevRow.name === row[""])
                        if (prevRowIndex !== -1) {
                            return {
                                ...prevRows[prevRowIndex],
                                selectionCount: count,
                                columns: col
                            }
                        }

                        return {
                            name: row[""],
                            subject: "none",
                            id: uuidv4(),
                            selectionCount: count,
                            columns: col
                        }; 
                    }); 

                    setRows(rows);
                } catch (error) {
                    console.error("Invalid CSV format");
                }
            },
            error: (error: any) => {
                console.error("Error parsing CSV:", error);
            },
        });
    }

    return (
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
    )
}

export const ImportAll = () => {
    const inputJSONFile = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch()
    const addHistoryState: any = (val: ScheduleBuilderAction) => dispatch(addState(val))
    
    const clickJSON = () => inputJSONFile.current!.click();
    
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
                        addHistoryState({
                            type: "POST", 
                            message: "Imported from JSON",
                            action: {rows: json.rows, columns: json.columns, selections: json.selections}
                        })
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
        <div className='importAll-container'>
            <ImportByCSV />

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
    )
}

// Convention:
// name, id, etc.
export const ImportOneDataByCSV = ({setNewData}: any) => {
    const inputCSVFile = useRef<HTMLInputElement>(null);
    const clickCSV = () => inputCSVFile.current!.click();

    const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== 'text/csv') {
            console.error("Invalid file type.");
            return;
        }
        Papa.parse(file, {
            header: true,
            dynamicTyping: false,
            skipEmptyLines: true,
            complete: (results: any) => {
                try {
                    if (results.data.length > 0) setNewData(results.data)
                } catch (error) {
                    console.error("Invalid CSV format");
                }
            },
            error: (error: any) => {
                console.error("Error parsing CSV:", error);
            },
        });
    }

    return (
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
    )
}

export const ImportOneDataByJSON = ({setNewData, prevData}: any) => {
    const inputJSONFile = useRef<HTMLInputElement>(null);
    
    const clickJSON = () => inputJSONFile.current!.click();
    
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

                    if (json.rows || json.columns || json.selections) {
                        console.log([...json[Object.keys(json)[0]]])
                        const key = Object.keys(json)[0]
                        let data = [...json[key]].reduce((newData: typeof prevData, acc: any) => {
                            const prevIndex = newData.findIndex((prev: any) => prev.name === acc["name"])
                            const prevIDIndex = newData.findIndex((prev: any) => prev.id === acc["id"])
                            
                            return (prevIndex === -1 && prevIDIndex === -1) ? [...newData, acc] : newData
                        }, prevData)

                        setNewData({[key]: data})
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
    )
}