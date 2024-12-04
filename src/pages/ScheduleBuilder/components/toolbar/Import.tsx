import React, { Children, FC, ReactElement, useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
    addState, 
    newColumns, 
    newRows, 
    newSelections, 
    newSubjects, 
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
import ConfirmationPopup from '@/src/components/ConfirmationPopup';

import { SliderPicker  } from 'react-color';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';

import '@/src/components/components.css'
import { defaultSelection, selectionCountValue } from '@/lib/features/Utilities';

function convertStringToBoolean(value: string): string | boolean {
    if (typeof value == "string") {
        if (value.toLowerCase() === 'true') {
            return true;
        } else if (value.toLowerCase() === 'false') {
            return false;
        }
    }
    return value;
}

const ImportByCSV = ({getValues}: {getValues: Array<string>} = {getValues: []}) => {
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

const ImportAll = () => {
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
            <ImportByCSV getValues={[]} />
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
    
    const dispatch = useAppDispatch()
    const setSubjects: any = (val: Array<Subject>) => dispatch(newSubjects(val))

    const [currentSubject, setCurrentSubject] = useState<Subject>()
    const [newSubject, setNewSubject] = useState<Subject>({name: "", color: "#"})
    
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
    const [deleteConfirmationResult, setDeleteConfirmationResult] = useState(false)
    
    const [isFinishConfirmationOpen, setIsFinishConfirmationOpen] = useState(false)
    const [finishConfirmationResult, setFinishConfirmationResult] = useState(false)

    const [subjectSearch, setSubjectSearch] = useState("")

    useEffect(() => {
        if (deleteConfirmationResult && isDeleteConfirmationOpen) {
            setIsDeleteConfirmationOpen(false)

            setSubjects([...subjects].filter((subject) => (subject != currentSubject)))
            setCurrentSubject(undefined)
            setNewSubject({name: "", color: "#000000"})
            setDeleteConfirmationResult(false)
        } else if (finishConfirmationResult && isFinishConfirmationOpen) {
            setIsFinishConfirmationOpen(false)
            if (!currentSubject) {
                setSubjects([...subjects, newSubject])
            } else {
                setSubjects([...subjects].map((subject) => (subject.name === currentSubject.name ? newSubject : subject)))
            }
            setCurrentSubject(newSubject)
            setFinishConfirmationResult(false)
        }
    }, [deleteConfirmationResult, finishConfirmationResult, newSubject])

    
    return (
        <div className="shade" onClick={() => props.setIsEditSubjectsOpen(false)}>
            <div className="edit-subjects-container" onClick={(e) => e.stopPropagation()}>
                {isDeleteConfirmationOpen && 
                    <ConfirmationPopup setConfirmationResult={setDeleteConfirmationResult} close={() => setIsDeleteConfirmationOpen(false)}>
                        <h3>Delete Subject: {currentSubject && currentSubject?.name.charAt(0).toUpperCase() + currentSubject?.name.slice(1)}?</h3>
                        <p>Subject assignment will not be erased, but subject data will. This subject will be filterable as "None".</p>
                    </ConfirmationPopup>}
                {isFinishConfirmationOpen && 
                    <ConfirmationPopup setConfirmationResult={setFinishConfirmationResult} close={() => setIsFinishConfirmationOpen(false)}>
                        <h3>Finish Working on Subject: {newSubject?.name.charAt(0).toUpperCase() + newSubject?.name.slice(1)}?</h3>
                    </ConfirmationPopup>}
                <h2>Subjects</h2>
                <div className="edit-subjects-content">
                    <div className='subjects-container'>
                        <div className='subjects-header'>
                            <textarea className="subjects-search choice-search search-input" onChange={(e) => setSubjectSearch(e.target.value)} value={subjectSearch} placeholder='Search ' />
                            <div className="column-choice-element add-btn sticky top-0" onClick={() => {setCurrentSubject(undefined); setNewSubject({name: "", color: "#000000"})}}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                            </div>
                        </div>
                        <div className='subjects'>   
                            {/* Subjects is a set */}
                            {[...subjects].map((subject: Subject) => {
                                if (subjectSearch.trim() !== "" && !subject.name.toLowerCase().includes(subjectSearch.trim().toLowerCase())) return
                                return (
                                    <div style={{
                                            borderColor: subject.color
                                        }}
                                        className={'subject'}
                                        onClick={() => {setCurrentSubject(subject); setNewSubject(subject)}}
                                    >
                                        {subject.name.slice(0, 1).toUpperCase() + subject.name.slice(1)}
                                    </div>
                            )})}
                        </div>
                    </div>
                    <div className="edit-subject-container">
                        <h3>{currentSubject ? "Edit " + currentSubject.name.slice(0, 1).toUpperCase() + currentSubject.name.slice(1) : "Add"}</h3> 
                        <div className='edit-subject-container-child'>
                            <div className="editting-container" style={{borderColor: newSubject ? newSubject.color : "black"}}>
                                <div className="editting-container-child">
                                    <h4>Name:</h4><textarea className="edit-subject-textarea choice-search search-input" onChange={(e) => {setNewSubject((prevNewSubject) => ({name: e.target.value.toLowerCase(), color: prevNewSubject.color}))}} value={newSubject.name} placeholder={currentSubject ? currentSubject.name : 'Name'} />
                                    <h4>Color: </h4>
                                    <SliderPicker color={ newSubject.color } onChange={(e: {hex: any}) => {setNewSubject((prevNewSubject) => ({name: prevNewSubject.name, color: e.hex}))}} className='color-picker' />
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div 
                                    className={'finish-subject-btn ' + 
                                        (!currentSubject && "w-full ") + 
                                        (newSubject.name.trim() !== "" && " highlight")} 
                                        onClick={() => (newSubject.name.trim() !== "" && setIsFinishConfirmationOpen(true))}>
                                            Confirm
                                </div>
                                {currentSubject && <div className='delete-subject-btn' onClick={() => setIsDeleteConfirmationOpen(true)}>Delete</div>}  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Edit = (props: {children: React.ReactNode, onConfirm: any, onDelete: () => void, setValue?: React.Dispatch<React.SetStateAction<any>>, closeEdit: () => void, disabled: boolean}) => { 
    return (
        <div className='shade' onClick={props.closeEdit}>
            <div className="edit-container" onClick={(e) => e.stopPropagation()}>
                {props.children}
                <div className="flex flex-row">
                    <div className={"confirmation-btn y-confirmation " + (!props.disabled && "highlight")} onClick={() => {props.onConfirm()}}>Confirm</div>
                    <div className={"confirmation-btn n-confirmation " + (!props.disabled && "highlight")} onClick={() => {props.onDelete()}}>Delete</div>
                </div>
            </div>
        </div>
    )
}

// Turns an odd/even column back to normal
function normalizeColumn(column: Column): Column {
    if (column.oddEven === "ODD") {
        return {...column, id: column.id.slice(0, column.id.length - 4), name: column.name.slice(0, column.name.length - 4)}
    } else if (column.oddEven === "EVEN") {
        return {...column, id: column.id.slice(0, column.id.length - 5), name: column.name.slice(0, column.name.length - 5)}
    }

    return column
}

// Rows on the right side of the table (teacher rows)
const Import = (props: {setIsImportOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [isEditSubjectsOpen, setIsEditSubjectOpen] = useState(false)
    
    const dispatch = useAppDispatch()
    const setColumns: any = (val: any) => dispatch(newColumns(val))
    const setRows: any = (val: any) => dispatch(newRows(val))
    const setSelections: any = (val: any) => dispatch(newSelections(val))

    const rows = useAppSelector(selectRows)
    const columns = useAppSelector(selectColumns)
    const selections = useAppSelector(selectSelections)
    const subjects = useAppSelector(selectSubjects)
    const subject_object = [...subjects.map((subject: Subject) => ({
        value: subject.name,
        label: subject.name.charAt(0).toUpperCase() + subject.name.slice(1)
    })), {value: "none", label: "None"}]

    const [rowSearch, setRowSearch] = useState("")
    const [columnSearch, setColumnSearch] = useState("")
    const [selectionSearch, setSelectionSearch] = useState("")
    const [openConfirmationPopup, setOpenConfirmationPopup] = useState<undefined | {children: ReactElement, onConfirm: () => void}>(undefined)

    // Value currently being changed, (never actually changed, just used as reference)
    const [currentEdit, setCurrentEdit] = useState<{editting: string, value: Column | Selection | Row | undefined}>()
    // Value which gets actively changed, for column this value gets normalized, set as the regular version of columns
    const [newValue, setNewValue] = useState<Column | Selection | Row>()

    const editColumn = () => {
        if (columns.findIndex((col) => col.name === newValue?.name && col.id !== newValue?.id) !== -1) {
            return
        }
        if (currentEdit?.value) {
            setColumns(columns.map((column) => {
                if (column.oddEven === "ODD" && column.id.slice(0, column.id.length - 4) === String(currentEdit?.value?.id).slice(0, column.id.length - 4)) {
                    return {...newValue, id: column.id, name: newValue?.name + " Odd"}
                } else if (column.oddEven === "EVEN" && column.id.slice(0, column.id.length - 5) === String(currentEdit?.value?.id).slice(0, column.id.length - 5)) {
                    return {...newValue, id: newValue?.id + "-even", name: newValue?.name + " Even", oddEven: "EVEN"}
                } else if (column.id === newValue?.id) {return newValue}
                else { return column }
            })) 
        } else {
            let newId = uuidv4();
            while (newId.endsWith("odd") || newId.endsWith('even')) {
                newId = uuidv4()
            }
            setColumns([...columns, {...newValue, id: newId}])
        }

        setCurrentEdit(undefined)
        setNewValue(undefined)
    }
    const deleteColumn = () => {
        setColumns(
            columns.filter((column) => 
                column.id !== currentEdit?.value?.id &&
                !(column.oddEven === "EVEN" && 
                    column.id.slice(0, column.id.length - 5) === String(currentEdit?.value?.id).slice(0, column.id.length - 5)
                )
            )
        )
        setCurrentEdit(undefined)
        setNewValue(undefined)
    }

    const editRow = () => {
        if (currentEdit?.value) {
            setRows(rows.map((row) => row.id === newValue?.id ? newValue :row)) 
        } else {
            setRows([...rows, 
                {...newValue, 
                    subject: (newValue as Row).subject ? (newValue as Row).subject : "none", 
                    id: uuidv4(),
                    selectionCount: 0,
                    columns: columns.reduce((acc: Row["columns"], column: Column) => {
                        acc[column.id] = defaultSelection
                        return acc
                    }, {})
                }])
        }

        setCurrentEdit(undefined)
        setNewValue(undefined)
    }
    const deleteRow = () => {
        setRows([...rows.filter((row) => row.id !== currentEdit?.value?.id)])
        
        setCurrentEdit(undefined)
        setNewValue(undefined)
        return
    }

    const editSelection = () => {
        if (currentEdit?.value) {
            setSelections(selections.map((selection) => selection.id === newValue?.id ? newValue : selection)) 
            // Change rows to update subject change in selection
            if ((currentEdit.value as Selection).subject !== (newValue as Selection).subject) {
                setRows(rows.map((row: Row) => {
                    const newColumns = Object.keys(row.columns).reduce((acc: Row["columns"], item: any) => {
                        acc[item] = {...row.columns[item], subject: row.columns[item].id === newValue?.id ? (newValue as Selection).subject : row.columns[item].subject}
                        return acc
                    }, {})

                    return {...row, columns: newColumns}
                }))
            }

        } else {
            setSelections([...selections, 
                {...newValue,
                    subject: (newValue as Row).subject ? (newValue as Row).subject : "none", 
                    id: uuidv4()
                }])
        }

        setCurrentEdit(undefined)
        setNewValue(undefined)
    }
    const deleteSelection = () => {
        setSelections([...selections.filter((selection) => selection.id !== currentEdit?.value?.id)])

        setCurrentEdit(undefined)
        setNewValue(undefined)
        return
    }
    
    return (
        <div className="shade" onClick={() => props.setIsImportOpen(false)}>
            <div className="import-container" onClick={(e) => e.stopPropagation()}>

                <h1>Import</h1>
                <div className="importAll-editSubjects-container">
                    <ImportAll />
                    <div className="edit-subjects-btn" onClick={() => (setIsEditSubjectOpen(prevState => !prevState))}>Edit Subjects</div>
                </div>

                {isEditSubjectsOpen && <EditSubjects setIsEditSubjectsOpen={setIsEditSubjectOpen} />}
                
                {currentEdit?.editting === "columns" && 
                <Edit 
                    closeEdit={() => (setCurrentEdit(undefined))}
                    disabled={newValue?.name.trim() === ""}
                    onConfirm={() => {newValue?.name.trim() !== "" && setOpenConfirmationPopup({
                        children: (
                        <div>
                            <h3>Confirm Change Column Name?</h3>
                        </div>), onConfirm: editColumn
                    })}}
                    onDelete={() => {setOpenConfirmationPopup({
                        children: (
                        <div>
                            <h3>Confirm Delete Column?</h3>
                            <p><b className='text-red-700'>WARNING</b> This will remove all data related to column <b>{currentEdit?.value?.name}</b></p>
                        </div>), onConfirm: deleteColumn
                    })}}>

                    <h3>{currentEdit?.value ? `Edit \"${String(currentEdit?.value?.id).endsWith("-odd") ? currentEdit?.value?.name.slice(0, currentEdit?.value?.name.length - 4) : currentEdit?.value?.name}\"` : "Add Column"}</h3>
                    <div className='edit-content'>
                        <h4>Name:</h4>
                        <textarea className="edit-subject-textarea choice-search search-input" 
                            onChange={(e) => {setNewValue((prevNewValue: any) => ({...prevNewValue, name: e.target.value}))}} 
                            value={newValue?.name} 
                            placeholder={currentEdit.value ? normalizeColumn(currentEdit.value as Column).name : 'Name'} />
                    </div>
                </Edit>}
                {currentEdit?.editting === "rows" && 
                <Edit 
                    closeEdit={() => (setCurrentEdit(undefined))}
                    disabled={newValue?.name.trim() === ""}
                    onConfirm={() => {newValue?.name.trim() !== "" && setOpenConfirmationPopup({
                        children: (
                        <div>
                            <h3>Confirm Change Rows?</h3>
                        </div>), onConfirm: editRow
                    })}}
                    onDelete={() => {setOpenConfirmationPopup({
                        children: (
                        <div>
                            <h3>Confirm Delete Row?</h3>
                            <p><b className='text-red-700'>WARNING</b> This will remove all data related to row <b>{currentEdit?.value?.name}</b></p>
                        </div>), onConfirm: deleteRow
                    })}}>
                    <h3>{currentEdit?.value ? `Edit \"${currentEdit?.value?.name}\"` : "Add Row"}</h3>
                    <div className='edit-content'>
                        <h4>Name:</h4>
                        <textarea className="edit-subject-textarea choice-search search-input" 
                            onChange={(e) => {setNewValue((prevNewValue: any) => ({...prevNewValue, name: e.target.value}))}} 
                            value={newValue?.name} 
                            placeholder={currentEdit.value ? currentEdit.value.name : 'Name'} />
                        <h4>Subject:</h4>
                        <Select 
                            options={subject_object}
                            value={{value: newValue as Row ? (newValue as Row).subject : 'none', label: newValue as Row && (newValue as Row).subject ? (newValue as Row).subject.charAt(0).toUpperCase() + (newValue as Row).subject.slice(1) : "None"}}
                            backspaceRemovesValue
                            onChange={(e: any) => {setNewValue((prevNewValue: any) => ({...prevNewValue, subject: e["value"]}))}}/>
                    </div>
                </Edit>}
                {currentEdit?.editting === "selections" && 
                <Edit 
                    closeEdit={() => (setCurrentEdit(undefined))}
                    disabled={newValue?.name.trim() === ""}
                    onConfirm={() => {newValue?.name.trim() !== "" && setOpenConfirmationPopup({
                        children: (
                        <div>
                            <h3>Confirm Change Selection?</h3>
                        </div>), onConfirm: editSelection
                    })}}
                    onDelete={() => {setOpenConfirmationPopup({
                        children: (
                        <div>
                            <h3>Confirm Delete Selection?</h3>
                            <p><b className='text-red-700'>WARNING</b> This will remove all data related to row <b>{currentEdit?.value?.name}</b> (Selections already placed will not be deleted)</p>
                        </div>), onConfirm: deleteSelection
                    })}}>
                    <h3>{currentEdit?.value ? `Edit \"${currentEdit?.value?.name}\"` : "Add Selection"}</h3>
                    <div className='edit-content'>
                        <h4>Name:</h4>
                        <textarea className="edit-subject-textarea choice-search search-input" 
                            onChange={(e) => {setNewValue((prevNewValue: any) => ({...prevNewValue, name: e.target.value}))}} 
                            value={newValue?.name} 
                            placeholder={currentEdit.value ? currentEdit.value.name : 'Name'} />
                        <h4>Subject:</h4>
                        <Select 
                            options={subject_object}
                            value={{value: newValue as Selection ? (newValue as Selection).subject : "none", label: newValue as Selection && (newValue as Selection).subject ? (newValue as Selection).subject.charAt(0).toUpperCase() + (newValue as Row).subject.slice(1) : "None"}}
                            backspaceRemovesValue
                            onChange={(e: any) => {setNewValue((prevNewValue: any) => ({...prevNewValue, subject: e["value"]}))}}/>
                    </div>
                </Edit>}

                {openConfirmationPopup !== undefined && 
                <ConfirmationPopup setConfirmationResult={(res: boolean) => {if (res) {openConfirmationPopup.onConfirm(); setOpenConfirmationPopup(undefined)}}} close={() => setOpenConfirmationPopup(undefined)}>
                    {openConfirmationPopup.children}
                </ConfirmationPopup>}

                <div className='imports-choices'>
                    <div className='choice'>
                        <h3>Columns</h3>
                        <div className="choice-elements-container">
                            <div className="choice-top-sticky top-0 sticky">
                                <textarea className="choice-search search-input" onChange={(e) => {setColumnSearch(e.target.value)}} value={columnSearch} placeholder='Search' />
                                <div className="column-choice-element add-btn sticky top-0" onClick={() => setCurrentEdit({editting: "columns", value: undefined})}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                                </div>
                            </div>
                            {columns.map((column: Column) => {
                                // Every time something is even, there is an odd
                                if (column.oddEven == "EVEN" ||
                                    (columnSearch !== "" && !(column.name.trim().toLowerCase()).includes(columnSearch.trim().toLowerCase())) 
                                ) return

                                return (
                                    <div className="column-choice-element" onClick={() => {setCurrentEdit({editting: "columns", value: column}); setNewValue(normalizeColumn(column))}}>
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
                                <div className="column-choice-element add-btn sticky top-0" onClick={() => setCurrentEdit({editting: "rows", value: undefined})}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                                </div>
                            </div>
                            {rows.map((row: Row) => {
                                if (rowSearch !== "" && !(row.name.trim().toLowerCase()).includes(rowSearch.trim().toLowerCase())) return
                                return (
                                    <div className="row-choice-element" onClick={() => {setCurrentEdit({editting: "rows", value: row}); setNewValue(row)}}>
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
                                <div className="column-choice-element add-btn sticky top-0" onClick={() => setCurrentEdit({editting: "selections", value: undefined})}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                                </div>
                            </div>
                            {selections.map((selection: Selection) => {
                                if (selectionSearch !== "" && !(selection.name.trim().toLowerCase()).includes(selectionSearch.trim().toLowerCase())) return
                                return (
                                    <div className="selection-choice-element" onClick={() => {setCurrentEdit({editting: "selections", value: selection}); setNewValue(selection)}}>
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