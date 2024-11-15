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
            let newRowArray: Array<Row> = [...rows];

            // Deleting old selection when moving element and not copying
            if (!settings.isCopySelection && action.prevToChange !== undefined && action.prevColumnId !== undefined) {
                console.log('here')
                newRowArray = removeSelection(newRowArray, columns, action.prevToChange, action.prevColumnId, defaultSelection)
            }
            console.log(newRowArray)
            newRowArray = addSelection(newRowArray, columns, action.toChange, action.columnId, action.selection)
            
            return {rows: newRowArray, columns: columns};
        case "DELETE_SIMPLE_ROW":   
            let newRowsArray: Array<Row> = removeSelection(rows, columns, action.toChange, action.columnId, defaultSelection)
            return {rows: newRowsArray, columns}
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
                [columnId]: {...defaultSelection}
            },
            selectionCount: rows[toChange].selectionCount - (columns[columns.findIndex(column => column.id === columnId)].oddEven ? 0.5 : 1)
        }, 
        ...rows.slice(toChange + 1)
    ]

    return newRows
} 

// Corresponding row is found via the id
const assignOddEven = (
    rows: Array<Row>, 
    columns: Array<Column>, 
    { columnId }: { columnId: Column["id"] }
): {rows: Array<Row>, columns: Array<Column>} => {
    // Setting the rows
    let newRows = [...rows.map((row) => {
        return {
            ...{...row},
            columns: (() => {
                let values = {
                    ...row.columns,
                    [columnId + '-odd']: {...row.columns[columnId]},
                    [columnId + '-even']: {...row.columns[columnId]}
                }
                delete values[columnId]
                return values
            })()
        }
    })]

    // Setting the Columns
    const newColumns: Array<Column> = ((() => {
        let tempColumns = [...columns]

        const index = tempColumns.findIndex(column => columnId == column.id)
        if (tempColumns[index].oddEven || index === -1) return tempColumns;

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
        // Miss-matched even odd -> early termination to ensure data isn't erased by mistake
        if (rows[i].columns[columnId + '-odd'].id !== rows[i].columns[columnId + '-even'].id && !isUndo) {
            return { rows, columns, failed: true }
        }

        tempRows = [
            ...tempRows.slice(0, i),
            {
                ...tempRows[i],
                columns: (() => {
                    let values = {
                        ...tempRows[i].columns,
                        [columnId]: tempRows[i].columns[columnId + '-odd']
                    }
                    delete values[columnId + "-odd"]
                    delete values[columnId + "-even"]
                    return values
                })()
            },
            ...tempRows.slice(i + 1)
        ]
    }

    // Return column to normal
    let tempColumns = [...columns]
    // Even always after odd - identify odd and remove even alongside it
    const columnIndex: number = tempColumns.findIndex(column => column.id === columnId + "-odd")

    if (tempColumns[columnIndex].oddEven && columnIndex !== -1) {
        // Replace odd with regular
        tempColumns[columnIndex] = {
            ...tempColumns[columnIndex], 
            id: tempColumns[columnIndex].id.substring(0, tempColumns[columnIndex].id.length - 4), 
            name: tempColumns[columnIndex].name.substring(0, tempColumns[columnIndex].name.length - 4), 
            oddEven: false
        };
        // Remove even
        tempColumns.splice(columnIndex + 1, 1)
    }

    return {rows: tempRows, columns: tempColumns}
}

export const getRowSubjects = (rows: Array<Row>) => {
    let subjects: Set<string> = new Set([])

    for (let i in rows) {
        subjects.add(rows[i].subject)
    }

    return Array.from(subjects)
}