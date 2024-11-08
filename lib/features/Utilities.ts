import { ScheduleBuilderAction, Row, Settings, Column, Selection } from "../../types";
// REMINDER: TEST THIS

export const modifyRows = (
    { type, action }: ScheduleBuilderAction, 
    rows: Array<Row>, 
    columns: Array<Column>, 
    settings: Settings
): { rows: Array<Row>, columns: Array<Column>, failed?: boolean } => {
    // Default selection for blank spaces
    let defaultSelection: Selection = { name: "none", subject: "none", id: 0 }

    switch (type) {
        case "PATCH_SIMPLE_ROW":
            let newRowArray = addSelection(rows, action.toChange, action.columnId, action.selection)
            if (!settings.isCopySelection && action.prevToChange !== undefined && action.prevColumnId !== undefined) {
                // Deleting old selection 
                newRowArray = removeSelection(newRowArray, action.prevToChange, action.prevColumnId, defaultSelection)
            }
            
            return {rows: newRowArray, columns: columns};

        case "DELETE_SIMPLE_ROW":            
            let row: any = {...rows[action.toChange]}
            console.log("here", action.toChange, action.columnId, {...action.selection})

            // For the undo
            if (action?.prevAction?.action && 
                action.columnId.includes(action.prevAction.action.columnId)) {
                if (action.prevAction.type === "PATCH_EVEN_ODD" && !("selection" in action.prevAction.action)) {
                    defaultSelection = row.columns[action.prevAction.action.columnId]
                } else if (action.columnId.slice(action.columnId.length - 4, action.columnId.length) === "even" || action.columnId.slice(action.columnId.length - 3, action.columnId.length) === "odd") {
                    defaultSelection = action.prevAction.action.selection
                }
            }

            let tempRowArray = removeSelection(rows, action.toChange, action.columnId, defaultSelection)

            if (!settings.isOddEvenAutoAssign 
                && action.prevAction.action !== undefined 
                && action.prevAction.action.toChange !== undefined 
                && action.prevAction.action.columnId !== undefined 
                && action.prevAction.action.toChange === action.toChange 
                && action.prevAction.action.columnId === action.columnId) {
                tempRowArray = addSelection(tempRowArray, action.toChange, action.columnId, action.prevAction.action.selection)
            } 
            
            if (!settings.isCopySelection && action.prevToChange !== undefined && action.prevColumnId !== undefined) {
                // Adding old selection back (ONLY FOR UNDO)
                tempRowArray = addSelection(tempRowArray, action.prevToChange, action.prevColumnId, action.selection)
            }

            return {rows: tempRowArray, columns}
        case "PATCH_EVEN_ODD":
            return assignOddEven(rows, columns, settings, action)
        case "DELETE_EVEN_ODD":
            return removeEvenOdd(rows, columns, action)
        default:
            return {rows, columns}
    }
}   

const countSelections = (columns: Row["columns"]): number => {
    let selectionCount = 0

    for (const val in columns) {
        // Every even has an odd, and a regular - this is to balance out the regular being added
        if (val.endsWith("even")) {
            selectionCount -= 1
        }
        if (columns[val].id !== 0 && (val.endsWith("even") || val.endsWith("odd"))) {
            selectionCount += 0.5
        } else if (columns[val].id !== 0) {
            selectionCount += 1
        }
    }

    return selectionCount
}

// Tochange is the index of rows meant to be changed
const addSelection = (rows: Array<Row>, toChange: number, columnId: Column["id"], selection: Selection) => {
    let newRows: Array<Row> = [...rows.slice(0, toChange), 
        {
            ...rows[toChange], 
            columns: 
                    {
                        ...rows[toChange].columns, 
                        [columnId]: selection
                    }
        }, 
        ...rows.slice(toChange + 1)]
    
    newRows = [...newRows.slice(0, toChange),
        {
            ...newRows[toChange],
            selectionCount: countSelections(newRows[toChange].columns)
        },
        ...rows.slice(toChange + 1)
    ]

    return newRows
}

const removeSelection = (rows: Array<Row>, toChange: number, columnId: Column["id"], defaultSelection: Selection) => {    
    let newRows: Array<Row> = [...rows.slice(0, toChange), 
        {
            ...rows[toChange],
            columns: {
                ...rows[toChange].columns,
                [columnId]: defaultSelection
            }
        }, 
        ...rows.slice(toChange + 1)
    ]

    newRows = [...newRows.slice(0, toChange),
        {
            ...newRows[toChange],
            selectionCount: countSelections(newRows[toChange].columns)
        },
        ...rows.slice(toChange + 1)
    ]

    return newRows
} 

// use -1 and null for the last two parameters 
// Coresponding row is found via the id
const assignOddEven = (
    rows: Array<Row>, 
    columns: Array<Column>, 
    settings: Settings, 
    {columnId, toChange, selection}: {columnId: Column["id"], toChange?: Row["id"], selection?: Selection}
): {rows: Array<Row>, columns: Array<Column>} => {
    if (!settings.isOddEvenToggle) {
        return {rows, columns}
    }

    // Setting the rows
    const newRows = [...rows.map((row, i) => {
        return {
            ...{...row}, 
            columns: {
                ...row.columns,
                [columnId]: {...row.columns[columnId]},
                [columnId + '-odd']: {...row.columns[columnId]},
                [columnId + '-even']: (selection && i == toChange) ? selection : {...row.columns[columnId]}
            }
        }
    })]

    // Setting the Columns
    const newColumns: Array<Column> = ((() => {
        let tempColumns = [...columns]

        for (let i = 0; i < tempColumns.length; i++) {
            if (tempColumns[i].id == columnId) {
                if (tempColumns[i].oddEven) break;

                tempColumns.splice(i + 1, 0, {...tempColumns[i], id: tempColumns[i].id + '-even', name: tempColumns[i].name + ' Even', oddEven: true});
                tempColumns[i] = {...tempColumns[i], id: tempColumns[i].id + '-odd', name: tempColumns[i].name + ' Odd', oddEven: true};
                    
                break;
            }
        }

        return tempColumns
    })())

    return {rows: newRows, columns: newColumns}
}


const removeEvenOdd = (
    rows: Array<Row>, 
    columns: Array<Column>, 
    { columnId, isUndo }: { columnId: Column["id"], isUndo?: boolean }
): {rows: Array<Row>, columns: Array<Column>, failed?: boolean}  => {
    // Removing evenodd from each row in that specific column

    let tempRows = [...rows]

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].columns[columnId + '-odd'].id !== rows[i].columns[columnId + '-even'].id && !isUndo) {
            // Missmatched even odd -> early termination to ensure data isn't erased by mistake
            return { rows, columns, failed: true }
        }

        tempRows = [
            ...(tempRows.slice(0, i)),
            {
                ...tempRows[i],
                columns: {
                    ...tempRows[i].columns,
                    [columnId]: tempRows[i].columns[columnId + '-odd']
                }
            },
            ...(tempRows.slice(i+1, tempRows.length))
        ]
    }

    let tempColumns = [...columns]
    for (let i = 0; i < tempColumns.length; i++) {
        if (tempColumns[i].id == columnId  + "-odd") {
            if (!tempColumns[i].oddEven) break;
            tempColumns.splice(i + 1, 1)
            tempColumns[i] = {...tempColumns[i], id: tempColumns[i].id.toString().substring(0, tempColumns[i].id.toString().length - 4), name: tempColumns[i].name.substring(0, tempColumns[i].name.length - 4), oddEven: false};
                
            break;
        }
    }

    return {rows: tempRows, columns: tempColumns}
}