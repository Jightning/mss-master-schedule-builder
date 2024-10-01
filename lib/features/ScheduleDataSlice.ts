import { createSlice, current  } from '@reduxjs/toolkit'
import {
    Column,
    Row,
    Selection,
    Filter,
    Settings
} from "@/types"

interface InitialStateType {
    filterLocation: string,
    settings: Settings,
    filter: Filter
    rows: Array<Row>,
    columns: Array<Column>,
    selections: Array<Selection>
}

const initialState: InitialStateType = 
{
    filterLocation: "rows",
    settings: {
        oddEvenToggle: true,
        oddEvenAutoAssign: true,
        colorColumnSubjects: true,
        colorRowSubjects: false
    },
    filter: {
        selections: {
            searchTerm: ""
        },
        rows: {
            searchTerm: ""
        }
    },
    rows: [
        { name: "A. Teacher", subject: "math", id: 10394, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "B. Teacher", subject: "science", id: 10324, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "CB. Teacher", subject: "english", id: 101101, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "C. Teacher", subject: "math", id: 10395, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "D. Teacher", subject: "science", id: 10396, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "Mrs. Dedededededadsashfauifbasufas", subject: "math", id: 103446, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "E. Teacher", subject: "math", id: 10397, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "F. Teacher", subject: "math", id: 10398, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "G. Teacher", subject: "english", id: 10399, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "H. Teacher", subject: "math", id: 10320, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
        { name: "I. Teacher", subject: "english", id: 10349, columns: {"period_1": {name: "none", id:0 }, "period_2": {name: "none", id:0 }, "period_3": {name: "none", id:0 }, "period_4": {name: "none", id:0 }, "period_5": {name: "none", id:0 }, "period_6": {name: "none", id:0 }, "period_7": {name: "none", id:0 }, "period_8": {name: "none", id:0 }, "period_9": {name: "none", id:0 }} },
    ],
    columns: [
        { name: "Period 1", id: "period_1", oddEven: false, subcolumns: [{name: "Odd", id:"period_1_odd"}, {name: "Even", id:"period_1_even"}] },
        { name: "Period 2", id: "period_2", oddEven: false, subcolumns: [{name: "Odd", id:"period_2_odd"}, {name: "Even", id:"period_2_even"}] },
        { name: "Period 3", id: "period_3", oddEven: false, subcolumns: [{name: "Odd", id:"period_3_odd"}, {name: "Even", id:"period_3_even"}] },
        { name: "Period 4", id: "period_4", oddEven: false, subcolumns: [{name: "Odd", id:"period_4_odd"}, {name: "Even", id:"period_4_even"}] },
        { name: "Period 5", id: "period_5", oddEven: false, subcolumns: [{name: "Odd", id:"period_5_odd"}, {name: "Even", id:"period_5_even"}] },
        { name: "Period 6", id: "period_6", oddEven: false, subcolumns: [{name: "Odd", id:"period_6_odd"}, {name: "Even", id:"period_6_even"}] },
        { name: "Period 7", id: "period_7", oddEven: false, subcolumns: [{name: "Odd", id:"period_7_odd"}, {name: "Even", id:"period_7_even"}] },
        { name: "Period 8", id: "period_8", oddEven: false, subcolumns: [{name: "Odd", id:"period_8_odd"}, {name: "Even", id:"period_8_even"}] },
        { name: "Period 9", id: "period_9", oddEven: false, subcolumns: [{name: "Odd", id:"period_9_odd"}, {name: "Even", id:"period_9_even"}] }
    ],
    selections: [
        { name: "Comp Sci", id: 33437 },
        { name: "AP Physics 1", id: 3343855 },
        { name: "AP Physics 2", id: 334348 },
        { name: "AP Physics 3", id: 3343238 },
        { name: "AP Physics 4", id: 3343328 },
        { name: "AP Physics 5", id: 3343548 },
        { name: "AP Physics 6", id: 3343068 },
        { name: "AP Physics 7", id: 334398 },
        { name: "AP Physics 8", id: 334868 },
        { name: "AP Physics 9", id: 334548 },
        { name: "A", id: 130039239 },
        { name: "AP Physics 100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", id: 332448 },
        { name: "AP Physics 11", id: 33443 },
        { name: "AP Physics 12", id: 33428 },
        { name: "AP Physics 13", id: 33438 },
        { name: "AP Physics 14", id: 33238 },
        { name: "AP Physics 15", id: 324238 },
        { name: "AP Physics 16", id: 33644238 },
        { name: "AP Physics 17", id: 33425693832 },
        { name: "AP Physics 18", id: 3342385471},
        { name: "AP Physics 19", id: 3342342532812 },
        { name: "AP Physics 20", id: 33423064223228 },
        { name: "AP Physics 21", id: 3342934228054 },
        { name: "AP Physics 22", id: 334623422807 },
        { name: "AP Physics 23", id: 3342342285708 },
        { name: "AP Physics 24", id: 3342342228 },
        { name: "AP Physics 25", id: 334234282234 },
        { name: "AP Physics 26", id: 3342342854 },
        { name: "AP Physics 27", id: 3342322876 },
        { name: "AP Physics 28", id: 3342422818 },
        { name: "AP Physics 29", id: 3342422828 },
        { name: "AP Physics 30", id: 3342422838 },
        { name: "AP Physics 31", id: 332422848 },
        { name: "AP Physics 32", id: 3342422858 },
        { name: "AP Physics 33", id: 33424228786 },
        { name: "AP Physics 34", id: 3342422868 },
        { name: "AP Physics 35", id: 3342422878 },
        { name: "AP Physics 36", id: 3342422888 },
        { name: "AP Physics 37", id: 3342422898 },
        { name: "AP Physics 38", id: 33424228108 },
        { name: "AP Physics 39", id: 33424228118 }
    ]
}

export const scheduleDataSlice = createSlice({
    name: 'Schedule Data',
    initialState,
    reducers: {
        newFilterLocation: (state, action) => {
            state.filterLocation = action.payload
        },
        newSettings: (state, action) => {
            console.log("THIS", action.payload)
            state.settings = action.payload
        },
        newFilter: (state, action) => {
            state.filter = action.payload
        },
        newRows: (state, action) => {
            state.rows = action.payload
        },
        newColumns: (state, action) => {
            state.columns = action.payload
        },
        newSelections: (state, action) => {
            state.selections = action.payload
        },
    },
})

export const { newRows, newColumns, newSelections, newFilterLocation, newFilter, newSettings } = scheduleDataSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectRows = (state: { scheduleData: { rows: Array<Row> } }) => state.scheduleData.rows
export const selectColumns = (state: { scheduleData: { columns: Array<Column> }}) => state.scheduleData.columns
export const selectSelections = (state: { scheduleData: { selections: Array<Selection> }}) => state.scheduleData.selections

export const selectFilterLocation = (state: { scheduleData: { filterLocation: string } }) => state.scheduleData.filterLocation
export const selectFilter = (state: { scheduleData: { filter: Filter } }) => state.scheduleData.filter
export const selectSettings = (state: { scheduleData: { settings: Settings } }) => state.scheduleData.settings

export const getColumnSubjects = (state: { scheduleData: { columns: Array<Column> }}) => {
    let subjects: any = []
    let columns: Array<Column> = state.scheduleData.columns

    for (let i in columns) {
        console.log(columns[i])
    }

    return subjects
}


export default scheduleDataSlice.reducer