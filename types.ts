type HEX = `#${string}`

export interface Selection {
    name: string,
    subject: string,
    id: number | string,
}

export interface Column {
    name: string,
    id: string,
    oddEven: boolean,
    subcolumns?: Omit<Column, 'oddEven'>[]
}

// export interface Tile {
//     name: string,
//     subject: string
//     id: number | string,
// }
export interface Row {
    name: string,
    subject: string,
    id: number | string,
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
    oddEvenToggle: boolean,
    oddEvenAutoAssign: boolean,
    subjectLimit: boolean,
    copySelection: boolean,
    colorSelectionSubjects: boolean,
    colorRowSubjects: boolean
    colors: {
        [subject: string]: HEX
    }
}

export type ScheduleBuilderAction = {
    type: "PATCH_SIMPLE_ROW" | "DELETE_SIMPLE_ROW" | "PATCH_EVEN_ODD" | "DELETE_EVEN_ODD",
    action: {
        columnId: Column["id"],
        toChange: number,
        prevColumnId: Column["id"],
        prevToChange?: number,
        isUndo: boolean,
        prevAction: any,
        selection: Selection,

    },
}