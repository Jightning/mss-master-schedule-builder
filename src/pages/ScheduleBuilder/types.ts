export interface Selection {
    name: string,
    id: number | string
}

export interface Column {
    name: string,
    id: string
}

export interface Tile {
    name: string,
    id: number
}
export interface Row {
    name: string,
    subject: string,
    id: number,
    columns: Record<Column["id"], Tile>
}