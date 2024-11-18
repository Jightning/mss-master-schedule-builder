type HEX = `#${string}`

export interface Selection {
    name: string,
    subject: string,
    id: number | string,
}

export interface Column {
    name: string,
    id: string,
    oddEven: false | "EVEN" | "ODD",
}

// export interface Tile {
//     name: string,
//     subject: string
//     id: number | string,
// }
export interface Row {
    name: string,
    subject: string,
    id: number,
    selectionCount: number
    columns: Record<Column["id"], Selection>
}

export interface ActiveSelectionInterface {
    selection: Selection,
    currentRowIndex: number | null
} 

export interface Filter {
    selections: {
        searchTerm: string,
        subjects: Array<Selection["subject"]>
    },
    rows: {
        searchTerm: string,
        subjects: Array<Row["subject"]>
    }
}

export interface Settings {
    isOddEvenToggle: boolean,
    isOddEvenAutoAssign: boolean,
    hasSelectionLimit: boolean,
    selectionLimit: number,
    isCopySelection: boolean,
    isColorSelectionSubjects: boolean,
    isColorRowSubjects: boolean
    colors: {
        [subject: string]: HEX
    }
}

export type ScheduleBuilderAction = {
    type: "PATCH_SIMPLE_ROW" | "DELETE_SIMPLE_ROW" | "PATCH_EVEN_ODD" | "DELETE_EVEN_ODD" | "POST",
    action: {
        columnId: Column["id"],
        toChange: number,
        prevColumnId?: Column["id"],
        prevToChange?: number,
        selection: Selection,
        ignoreHistory?: boolean,
        selections: Array<Selection>,
        rows: Array<Row>,
        columns: Array<Column>
    },
}