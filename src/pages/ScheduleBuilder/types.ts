export interface Selection {
    name: string,
    id: number | string,
}

export interface Column {
    name: string,
    id: string,
    oddEven: boolean
}

export interface Tile {
    name: string,
    id: number | string,
}
export interface Row {
    name: string,
    subject: string,
    id: number | string,
    columns: Record<Column["id"], Tile>
}

export interface ActiveSelectionInterface {
    selection: Selection,
    currentRowIndex: number | null
} 