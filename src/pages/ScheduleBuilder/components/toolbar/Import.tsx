import React, { useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
import { useAppDispatch } from '@/lib/hooks';
import { addState, newColumns, newRows, newSelections } from '@/lib/features/ScheduleDataSlice';
import { ScheduleBuilderAction } from '@/types';


// Rows on the right side of the table (teacher rows)
const Import = (props: {setIsImportOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const importRef = useRef<HTMLDivElement>(null)
    
    const dispatch = useAppDispatch()
    const setColumns: any = (val: string) => dispatch(newColumns(val))
    const setRows: any = (val: string) => dispatch(newRows(val))
    const setSelections: any = (val: string) => dispatch(newSelections(val))
    const addHistoryState: any = (val: ScheduleBuilderAction) => dispatch(addState(val))



    const inputCSVFile = useRef<HTMLInputElement>(null);
    const inputJSONFile = useRef<HTMLInputElement>(null);

    const clickCSV = () => inputCSVFile.current!.click();
    const clickJSON = () => inputJSONFile.current!.click();


    
    useEffect(() => {
        // To close the filter dropdown when the user clicks outside of it
        const handleClickOutside = (event: any) => {
            const export_btn = document.getElementById("import-btn")
            if (importRef.current 
                && !importRef.current.contains(event.target) 
                && event.target !== export_btn 
                && !export_btn?.contains(event.target)) {
    
                props.setIsImportOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);   

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                    console.log(results)
                    const columnNames = results.meta.fields.slice(1);
                    setColumns(columnNames.map((x: any, i: any) => { 
                        return {name: x, id: i, oddEven: results.data[results.data.length - 1][x]}; 
                    }));

                    // TODO: maybe handle nones and make them always have id = 0
                    const selections = [...new Set(results.data.map((row: any) => Object.values(row).slice(1)).flat())].map((x: any, i: any) => { 
                            return {name: x, id: i}; 
                        }
                    );

                    setSelections(selections);
                    
                    const selectionsDict = selections.reduce((acc: any, current: any) => { 
                        acc[current.name] = current; 
                        return acc; 
                    }, {});

                    const rows = results.data.map((row: any, i: any) => { 
                        return { 
                            name: row[""], 
                            subject: "none",
                            id: i,
                            // Have to count selections
                            selectionCount: 0,
                            columns: columnNames.reduce((acc: any, name: any, j: any) => { 
                                acc[j] = selectionsDict[row[name]]; 
                                return acc; 
                            }, {}) 
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
                        addHistoryState({type: "POST", action: {rows: json.rows, columns: json.columns, selections: json.selections}})
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
        <div className="import-container" ref={importRef}>
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
    )
}

export default Import