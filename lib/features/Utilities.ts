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
            let newRowArray = addSelection(rows, columns, action.toChange, action.columnId, action.selection)
            
            if (!settings.isCopySelection && action.prevToChange !== undefined && action.prevColumnId !== undefined) {
                // Deleting old selection when moving element and not copying
                newRowArray = removeSelection(newRowArray, columns, action.prevToChange, action.prevColumnId, defaultSelection)
            }
            
            return {rows: newRowArray, columns: columns};
        case "DELETE_SIMPLE_ROW":   
            return {
                rows: removeSelection(rows, columns, action.toChange, action.columnId, defaultSelection), 
                columns
            }
        case "PATCH_EVEN_ODD":
            if (!settings.isOddEvenToggle) {
                return {rows, columns}
            }
        
            return assignOddEven(rows, columns, action)
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

// toChange is the index of rows meant to be changed
const addSelection = (rows: Array<Row>, columns: Array<Column>, toChange: number, columnId: Column["id"], selection: Selection) => {
    let newRows: Array<Row> = [
        ...rows.slice(0, toChange), 
        {
            ...rows[toChange], 
            columns: {
                ...rows[toChange].columns, 
                [columnId]: selection
            },
            selectionCount: rows[toChange].selectionCount + (columns[columns.findIndex(column => column.id === columnId)].oddEven ? 0.5 : 1)
        }, 
        ...rows.slice(toChange + 1)
    ]

    return newRows
}

const removeSelection = (rows: Array<Row>, columns: Array<Column>, toChange: number, columnId: Column["id"], defaultSelection: Selection) => {    
    let newRows: Array<Row> = [
        ...rows.slice(0, toChange), 
        {
            ...rows[toChange],
            columns: {
                ...rows[toChange].columns,
                [columnId]: defaultSelection
            },
            selectionCount: rows[toChange].selectionCount - (columns[columns.findIndex(column => column.id === columnId)].oddEven ? 0.5 : 1)
        }, 
        ...rows.slice(toChange + 1)
    ]

    return newRows
} 

// use -1 and null for the last two parameters 
// Corresponding row is found via the id
const assignOddEven = (
    rows: Array<Row>, 
    columns: Array<Column>, 
    {columnId, toChange}: {columnId: Column["id"], toChange?: Row["id"]}
): {rows: Array<Row>, columns: Array<Column>} => {
    // Setting the rows
    const newRows = [...rows.map((row) => {
        return {
            ...{...row}, 
            columns: {
                ...row.columns,
                [columnId]: {...row.columns[columnId]},
                [columnId + '-odd']: {...row.columns[columnId]},
                [columnId + '-even']: {...row.columns[columnId]}
            }
        }
    })]

    // Setting the Columns
    const newColumns: Array<Column> = ((() => {
        let tempColumns = [...columns]

        const index = tempColumns.findIndex(column => columnId == column.id)
        if (tempColumns[index].oddEven && index != -1) return tempColumns;

        const { id, name } = tempColumns[index]

        const EvenColumn: Column = {
            ...tempColumns[index], 
            id: `${id}-even`, 
            name: `${name} Even`, 
            oddEven: 'EVEN'
        }

        const OddColumn: Column = {
            ...tempColumns[index], 
            id: `${id}-odd`, 
            name: `${name} Odd`, 
            oddEven: 'ODD'
        }

        return ([
            ...tempColumns.slice(0, index),
            OddColumn,
            EvenColumn,
            ...tempColumns.slice(index + 1)
        ])
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
            // Miss-matched even odd -> early termination to ensure data isn't erased by mistake
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
            ...(tempRows.slice(i + 1, tempRows.length))
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