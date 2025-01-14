type HEX = `#${string}`

// Name must be unique -> no need for an id
export type Subject = {
    name: string,
    color: HEX
}

export interface Selection {
    name: string,
    subject: Subject["name"],
    id: string,
}

export interface Column {
    name: string,
    id: string,
    oddEven: false | "EVEN" | "ODD",
}

export interface Row {
    name: string,
    subject: Subject["name"],
    id: string,
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
}

export type ScheduleBuilderAction = {
    type: "PATCH_SIMPLE_ROW" | "DELETE_SIMPLE_ROW" | "PATCH_EVEN_ODD" | "DELETE_EVEN_ODD" | "POST",
    message?: string,
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