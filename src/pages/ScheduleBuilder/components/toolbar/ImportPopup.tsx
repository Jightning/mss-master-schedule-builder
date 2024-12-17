import React, { ReactElement, useRef, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
    newColumns, 
    newRows, 
    newSelections, 
    newSubjects, 
    selectColumns, 
    selectRows, 
    selectSelections, 
    selectSubjects
} from '@/lib/features/ScheduleDataSlice';
import { 
    Column, 
    Row, 
    Selection,
    Subject
} from '@/types';
import ConfirmationPopup from '@/src/components/ConfirmationPopup';

import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';

import '@/src/components/components.css'
import { defaultSelection } from '@/lib/features/Utilities';
import { EditSubjectPopup } from './EditSubjectPopup';
import { ImportAll, ImportOneDataByCSV } from './ImportAll';
import { ExportOneDataByCSV } from './Export';

const Edit = (props: {children: React.ReactNode, onConfirm: any, onDelete: () => void, setValue?: React.Dispatch<React.SetStateAction<any>>, closeEdit: () => void, disabled: boolean}) => { 
    return (
        <div className='shade' onClick={props.closeEdit}>
            <div className="edit-container relative" onClick={(e) => e.stopPropagation()}>
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
const ImportPopup = (props: {setIsImportOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [isEditSubjectsOpen, setIsEditSubjectOpen] = useState(false)
    
    const dispatch = useAppDispatch()
    const setColumns: any = (val: any) => dispatch(newColumns(val))
    const setRows: any = (val: any) => dispatch(newRows(val))
    const setSelections: any = (val: any) => dispatch(newSelections(val))
    const setSubjects: any = (val: any) => dispatch(newSubjects(val))

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


    // Columns
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
    const setImportedColumns = (data: any) => {
        const importedData = data.reduce((newData: typeof columns, acc: any) => {
            // TODO dependent on name
            const similarCol = newData.findIndex((prev: any) => {prev = normalizeColumn(prev); return prev.name === acc["name"] || prev.id === acc["id"]})
            // If there is one which already had the same name or id just use that data
            if (similarCol !== -1) {
                return newData
            }
            
            return [...newData,
                {
                    name: acc["name"], 
                    id: acc["id"], 
                    oddEven: acc['oddEven'] == "true" || acc['oddEven'] == "false" ? (acc['oddEven'] == "true") : acc['oddEven']
                }
            ]
        }, columns)

        setColumns(importedData);
    } 

    // Rows
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
    const setImportedRows = (data: any) => {
        const importedData = data.reduce((newData: typeof rows, acc: any) => {
            // TODO dependent on name
            const prevRowIndex = newData.findIndex((prev: any) => prev.name === acc["name"])
            const prevRowIDIndex = newData.findIndex((prev: any) => prev.id === acc["id"])
            // If there is one which already had the same name just use that data
            // But if one which has the same id, override it
            // TODO handle same row id
            if (prevRowIndex === -1 && prevRowIDIndex === -1) {

                const rowCols = columns.reduce((colAcc: any, col: any) => { 
                    colAcc[col.id] = {...defaultSelection}
                    return colAcc; 
                }, {})

                const subjectIndex = subjects.findIndex((subj) => subj["name"] === acc["subject"])
                if (subjectIndex === -1) {
                    setSubjects([...subjects, {name: acc["subject"], color: "#000"}])
                }

                return [...newData, {
                    name: acc["name"],
                    subject: acc["subject"] === undefined ? "none" : acc["subject"],
                    id: acc["id"],
                    selectionCount: 0,
                    columns: {...rowCols}
                }]; 
            }

            return newData
        }, rows)

        setRows(importedData);
    } 


    // Selections
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
    const setImportedSelections = (data: any) => {
        const importedData = data.reduce((newData: typeof selections, acc: any) => {
            // TODO dependent on name
            const prevSelectionIndex = newData.findIndex((prev: any) => prev.name === acc["name"])
            const prevSelectionIDIndex = newData.findIndex((prev: any) => prev.id === acc["id"])
   
            // If there is one which already had the same name or id just use that data
            if (prevSelectionIndex === -1 && prevSelectionIDIndex === -1) {
                const subjectIndex = subjects.findIndex((subj) => subj["name"] === acc["subject"])
                if (subjectIndex === -1) {
                    setSubjects([...subjects, {name: acc["subject"], color: "#000"}])
                }
                
                return [...newData,
                    {
                        name: acc["name"],
                        subject: acc['subject'],
                        id: acc["id"], 
                    }
                ]
            }

            return newData
        }, selections)

        setSelections(importedData);
    } 
    
    return (
        <div className="shade" onClick={() => props.setIsImportOpen(false)}>
            <div className="import-container" onClick={(e) => e.stopPropagation()}>

                <h1>Import</h1>
                <div className="importAll-editSubjects-container">
                    <ImportAll />
                    <div className="edit-subjects-btn" onClick={() => (setIsEditSubjectOpen(prevState => !prevState))}>Edit Subjects</div>
                </div>

                {isEditSubjectsOpen && <EditSubjectPopup setIsEditSubjectsOpen={setIsEditSubjectOpen} />}
                
                {/* All Popups */}
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
                    <div className="imports-container">
                        <ImportOneDataByCSV setNewData={setImportedColumns} />
                    </div>
                    <div className="exports-container">
                        <ExportOneDataByCSV headerArray={Object.keys(columns.length > 0 ? columns[0] : [])} data={columns} name={"schedule_data_columns"}/>
                    </div>
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
                    <div className="imports-container">
                        <ImportOneDataByCSV setNewData={setImportedRows} />
                    </div>
                    <div className="exports-container">
                        <ExportOneDataByCSV headerArray={["name", "id", "subject"]} data={rows} name={"schedule_data_rows"}/>
                    </div>
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
                    <div className="imports-container">
                        <ImportOneDataByCSV setNewData={setImportedSelections} />
                    </div>
                    <div className="exports-container">
                        <ExportOneDataByCSV headerArray={["name", "id", "subject"]} data={selections} name={"schedule_data_selections"}/>
                    </div>

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

                {/* Confirmation Prompt */}
                {openConfirmationPopup !== undefined && 
                <ConfirmationPopup setConfirmationResult={(res: boolean) => {if (res) {openConfirmationPopup.onConfirm(); setOpenConfirmationPopup(undefined)}}} close={() => setOpenConfirmationPopup(undefined)}>
                    {openConfirmationPopup.children}
                </ConfirmationPopup>}

                {/* Main body */}
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
                                    <div className="column-choice-element" onClick={() => {setCurrentEdit({editting: "columns", value: column}); setNewValue(normalizeColumn(column))}} key={"import-column-" + column.id}>
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
                                    <div className="row-choice-element" onClick={() => {setCurrentEdit({editting: "rows", value: row}); setNewValue(row)}} key={'import-row-' + row.id}>
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
                                    <div className="selection-choice-element" onClick={() => {setCurrentEdit({editting: "selections", value: selection}); setNewValue(selection)}} key={"import-selection-" + selection.id}>
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

export default ImportPopup