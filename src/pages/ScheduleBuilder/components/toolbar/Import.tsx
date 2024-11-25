import React, { useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
    addState, 
    newColumns, 
    newRows, 
    newSelections, 
    selectColumns, 
    selectRows, 
    selectSelections, 
    selectSettings, 
    selectSubjects
} from '@/lib/features/ScheduleDataSlice';
import { 
    Column, 
    Row, 
    ScheduleBuilderAction,
    Selection,
    Subject
} from '@/types';

const ImportAll = () => {
    const inputCSVFile = useRef<HTMLInputElement>(null);
    const inputJSONFile = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch()
    const setColumns: any = (val: Array<Column>) => dispatch(newColumns(val))
    const setRows: any = (val: Array<Row>) => dispatch(newRows(val))
    const setSelections: any = (val: Array<Selection>) => dispatch(newSelections(val))
    const addHistoryState: any = (val: ScheduleBuilderAction) => dispatch(addState(val))
    
    const clickCSV = () => inputCSVFile.current!.click();
    const clickJSON = () => inputJSONFile.current!.click();

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
        <div className='importAll-container'>
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

const EditSubjects = (props: {setIsEditSubjectsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const subjects = useAppSelector(selectSubjects)
    const settings = useAppSelector(selectSettings)

    const [currentSubject, setCurrentSubject] = useState<Subject>()
    
    return (
        <div className="shade" onClick={() => props.setIsEditSubjectsOpen(false)}>
            <div className="edit-subjects-container" onClick={(e) => e.stopPropagation()}>
                <h2>Subjects</h2>
                <div className="edit-subjects-content">
                    <div className='subjects-container'>
                        <div>Add</div>
                        {/* Subjects is a set */}
                        {[...subjects].map((subject: Subject) => (
                            <div style={{
                                borderColor: subject.color
                            }}
                            className='subject'>
                                {subject.name.slice(0, 1).toUpperCase() + subject.name.slice(1)}
                            </div>
                        ))}
                    </div>
                    <div className="edit-subject-container">
                        <h3>{currentSubject ? "Edit " + currentSubject.name : "Add"}</h3>
                        <div className='flex'>
                            <div className="editting-container">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Rows on the right side of the table (teacher rows)
const Import = (props: {setIsImportOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [isEditSubjectsOpen, setIsEditSubjectOpen] = useState(false)
    
    const dispatch = useAppDispatch()
    const setColumns: any = (val: any) => dispatch(newColumns(val))
    const setRows: any = (val: any) => dispatch(newRows(val))
    const setSelections: any = (val: any) => dispatch(newSelections(val))
    const addHistoryState: any = (val: ScheduleBuilderAction) => dispatch(addState(val))

    const rows = useAppSelector(selectRows)
    const columns = useAppSelector(selectColumns)
    const selections = useAppSelector(selectSelections)

    const [rowSearch, setRowSearch] = useState("")
    const [columnSearch, setColumnSearch] = useState("")
    const [selectionSearch, setSelectionSearch] = useState("")
    
    return (
        <div className="shade" onClick={() => props.setIsImportOpen(false)}>
            <div className="import-container" onClick={(e) => e.stopPropagation()}>
                <h1>Import</h1>
                <div className="importAll-editSubjects-container">
                    <ImportAll />
                    <div className="edit-subjects-btn" onClick={() => (setIsEditSubjectOpen(prevState => !prevState))}>Edit Subjects</div>
                </div>

                {isEditSubjectsOpen && <EditSubjects setIsEditSubjectsOpen={setIsEditSubjectOpen} />}

                <div className='imports-choices'>
                    <div className='choice'>
                        <h3>Columns</h3>
                        <div className="choice-elements-container">
                            <div className="choice-top-sticky top-0 sticky">
                                <textarea className="choice-search search-input" onChange={(e) => {setColumnSearch(e.target.value)}} value={columnSearch} placeholder='Search' />
                                <div className="column-choice-element add-btn sticky top-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                                </div>
                            </div>
                            {columns.map((column: Column) => {
                                // Every time something is even, there is an odd
                                if (column.oddEven == "EVEN" ||
                                    (columnSearch !== "" && !(column.name.trim().toLowerCase()).includes(columnSearch.trim().toLowerCase())) 
                                ) return

                                return (
                                    <div className="column-choice-element">
                                        {column.oddEven == "ODD" ? column.name.slice(0, column.name.length - 4) : column.name}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='choice'>
                        <h3>Rows</h3>
                        <div className="choice-elements-container">
                            <div className="choice-top-sticky top-0 sticky">
                                <textarea className="choice-search search-input" onChange={(e) => {setRowSearch(e.target.value)}} value={rowSearch} placeholder='Search' />
                                <div className="column-choice-element add-btn sticky top-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                                </div>
                            </div>
                            {rows.map((row: Row) => {
                                if (rowSearch !== "" && !(row.name.trim().toLowerCase()).includes(rowSearch.trim().toLowerCase())) return
                                return (
                                    <div className="row-choice-element">
                                        {row.name}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='choice'>
                        <h3>Selections</h3>
                        <div className="choice-elements-container">
                            <div className="choice-top-sticky top-0 sticky">
                                <textarea className="choice-search search-input" onChange={(e) => {setSelectionSearch(e.target.value)}} value={selectionSearch} placeholder='Search' />
                                <div className="column-choice-element add-btn sticky top-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                                </div>
                            </div>
                            {selections.map((selection: Selection) => {
                                if (selectionSearch !== "" && !(selection.name.trim().toLowerCase()).includes(selectionSearch.trim().toLowerCase())) return
                                return (
                                    <div className="selection-choice-element">
                                        {selection.name}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Import