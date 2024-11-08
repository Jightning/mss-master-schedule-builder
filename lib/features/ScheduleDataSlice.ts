import { createSlice  } from '@reduxjs/toolkit'
import {
    Column,
    Row,
    Selection,
    Filter,
    Settings,
    ScheduleBuilderAction
} from "@/types"
import { modifyRows } from "./Utilities"


interface InitialStateType {
    filterLocation: string,
    settings: Settings,
    filter: Filter,
    rows: Array<Row>,
    columns: Array<Column>,
    selections: Array<Selection>,
    history: Array<{rows: Array<Row>, columns: Array<Column>}>,
    settingsHistory: Array<Settings & {step: number}>,
    currentStep: number
}

const defaultSelection = { name: "none", subject: "none", id: 0 }

const defaultSettings: Settings = {
    isOddEvenToggle: true,
    isOddEvenAutoAssign: true,
    hasSelectionLimit: true,
    selectionLimit: 4,
    isCopySelection: false,
    isColorSelectionSubjects: false,
    isColorRowSubjects: false,
    colors: {
        "math": "#FF0000",
        "science": "#00FF00",
        "english": "#ffff1a"
    }
}

const initialState: InitialStateType = 
{
    filterLocation: "rows",
    settings: defaultSettings,
    filter: {
        selections: {
            searchTerm: "",
            subjects: []
        },
        rows: {
            searchTerm: "",
            subjects: []
        }
    },
    rows: [
        { name: "A. Teacher", subject: "math", id: 10394, selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
        { name: "B. Teacher", subject: "science", id: 10324, selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
        { name: "CB. Teacher", subject: "english", id: 101101, selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
        { name: "C. Teacher", subject: "math", id: 10395, selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
        { name: "D. Teacher", subject: "science", id: 10396, selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
        { name: "Mrs. Dedededededadsashfauifbasufas", subject: "math", id: 103446, selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
        { name: "E. Teacher", subject: "math", id: 10397, selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
        { name: "F. Teacher", subject: "math", id: 10398, selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
        { name: "G. Teacher", subject: "english", id: 10399, selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
        { name: "H. Teacher", subject: "math", id: 10320, selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
        { name: "I. Teacher", subject: "english", id: 10349, selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    ],
    columns: [
        { name: "Period 1", id: "period_1", oddEven: false},
        { name: "Period 2", id: "period_2", oddEven: false},
        { name: "Period 3", id: "period_3", oddEven: false},
        { name: "Period 4", id: "period_4", oddEven: false},
        { name: "Period 5", id: "period_5", oddEven: false},
        { name: "Period 6", id: "period_6", oddEven: false},
        { name: "Period 7", id: "period_7", oddEven: false},
        { name: "Period 8", id: "period_8", oddEven: false},
        { name: "Period 9", id: "period_9", oddEven: false}
    ],
    selections: [
        { name: "Comp Sci", subject: "math", id: 33437 },
        { name: "AP Physics 1", subject: "science", id: 3343855 },
        { name: "AP Physics 2", subject: "science", id: 334348 },
        { name: "AP Physics 3", subject: "science", id: 3343238 },
        { name: "AP Physics 4", subject: "science", id: 3343328 },
        { name: "AP Physics 5", subject: "science", id: 3343548 },
        { name: "AP Physics 6", subject: "science", id: 3343068 },
        { name: "AP Physics 7", subject: "science", id: 334398 },
        { name: "AP Physics 8", subject: "science", id: 334868 },
        { name: "AP Physics 9", subject: "science", id: 334548 },
        { name: "A", subject: "english", id: 130039239 },
        { name: "AP Physics 100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", subject: "science", id: 332448 },
        { name: "AP Physics 11", subject: "science", id: 33443 },
        { name: "AP Physics 12", subject: "science", id: 33428 },
        { name: "AP Physics 13", subject: "science", id: 33438 },
        { name: "AP Physics 14", subject: "science", id: 33238 },
        { name: "AP Physics 15", subject: "science", id: 324238 },
        { name: "AP Physics 16", subject: "science", id: 33644238 },
        { name: "AP Physics 17", subject: "science", id: 33425693832 },
        { name: "AP Physics 18", subject: "science", id: 3342385471},
        { name: "AP Physics 19", subject: "science", id: 3342342532812 },
        { name: "AP Physics 20", subject: "science", id: 33423064223228 },
        { name: "AP Physics 21", subject: "science", id: 3342934228054 },
        { name: "AP Physics 22", subject: "science", id: 334623422807 },
        { name: "AP Physics 23", subject: "science", id: 3342342285708 },
        { name: "AP Physics 24", subject: "science", id: 3342342228 },
        { name: "AP Physics 25", subject: "science", id: 334234282234 },
        { name: "AP Physics 26", subject: "science", id: 3342342854 },
        { name: "AP Physics 27", subject: "science", id: 3342322876 },
        { name: "AP Physics 28", subject: "science", id: 3342422818 },
        { name: "AP Physics 29", subject: "science", id: 3342422828 },
        { name: "AP Physics 30", subject: "science", id: 3342422838 },
        { name: "AP Physics 31", subject: "science", id: 332422848 },
        { name: "AP Physics 32", subject: "science", id: 3342422858 },
        { name: "AP Physics 33", subject: "science", id: 33424228786 },
        { name: "AP Physics 34", subject: "science", id: 3342422868 },
        { name: "AP Physics 35", subject: "science", id: 3342422878 },
        { name: "AP Physics 36", subject: "science", id: 3342422888 },
        { name: "AP Physics 37", subject: "science", id: 3342422898 },
        { name: "AP Physics 38", subject: "science", id: 33424228108 },
        { name: "AP Physics 39", subject: "science", id: 33424228118 }
    ],
    history: [],
    settingsHistory: [{...defaultSettings, step: -1}],
    currentStep: -1
}

export const scheduleDataSlice = createSlice({
    name: 'Schedule Data',
    initialState,
    reducers: {
        newFilterLocation: (state, action) => {
            state.filterLocation = action.payload
        },
        newSettings: (state, action) => {
            state.settings = action.payload
            state.settingsHistory.push({...state.settings, step: state.currentStep})
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
        // History Reducers    
        addState: (state, action: {payload: ScheduleBuilderAction}) => {
            // Wierd -> I could possibly improve
            const modifications = modifyRows(action.payload, state.rows, state.columns, state.settings)
            if (modifications.failed) {
                return
            }

            const count = modifications.rows[action.payload.action.toChange]?.selectionCount

            if (count > state.settings.selectionLimit) {
                return
            }

            state.rows = modifications.rows
            state.columns = modifications.columns

            state.history = [...state.history.slice(0, state.currentStep + 1)]
            state.history.push({rows: modifications.rows, columns: modifications.columns})
            state.currentStep = state.history.length - 1

            state.settingsHistory = [...state.settingsHistory.slice(0, state.currentStep + 1)]
        },
        // BUG:
        // 1. When splitting evenodd and then adding one element and undoing, the element is removed completely and not replaced
        // with the previous one
        undoState(state) {
            if (state.currentStep > 0) {
                state.currentStep--;

                // Get the latest setting
                const setting = [...state.settingsHistory].reduce((prev: Settings & {step: number}, setting: Settings & {step: number}) => {
                    return setting.step < state.currentStep && (prev == null || setting.step > prev.step) ? setting : prev
                })

                const currentState = state.history[state.currentStep]

                state.rows = currentState.rows
                state.columns = currentState.columns
                state.settings = setting
            } else if (state.currentStep === 0) {
                state.currentStep--;

                state.rows = initialState.rows
                state.columns = initialState.columns
                state.settings = initialState.settings
            }
        },
        redoState(state) {
            if (state.currentStep < state.history.length - 1) {
                state.currentStep++;

                // Get the latest setting
                const setting = [...state.settingsHistory].reduce((prev: Settings & {step: number}, setting: Settings & {step: number}) => {
                    return setting.step < state.currentStep && (prev == null || setting.step > prev.step) ? setting : prev
                })
                
                const currentState = state.history[state.currentStep]

                state.rows = currentState.rows
                state.columns = currentState.columns
                state.settings = setting
            }
        },
        resetHistory(state) {
            state.history = [];
            state.settingsHistory = []
            state.currentStep = -1;
        }
    },
})

export const { newRows, newColumns, newSelections, newFilterLocation, newFilter, newSettings } = scheduleDataSlice.actions
export const { addState, undoState, redoState, resetHistory } = scheduleDataSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectRows = (state: { scheduleData: { rows: Array<Row> } }) => state.scheduleData.rows
export const selectColumns = (state: { scheduleData: { columns: Array<Column> }}) => state.scheduleData.columns
export const selectSelections = (state: { scheduleData: { selections: Array<Selection> }}) => state.scheduleData.selections

export const selectFilterLocation = (state: { scheduleData: { filterLocation: string } }) => state.scheduleData.filterLocation
export const selectFilter = (state: { scheduleData: { filter: Filter } }) => state.scheduleData.filter
export const selectSettings = (state: { scheduleData: { settings: Settings } }) => state.scheduleData.settings

export const selectCurrentStep = (state: { scheduleData: { currentStep: number } }) => state.scheduleData.currentStep
export const selectHistory = (state: { scheduleData: { history: Array<ScheduleBuilderAction> } }) => state.scheduleData.history

export const getRowSubjects = (state: { scheduleData: { rows: Array<Row> }}) => {
    let subjects: Set<string> = new Set([])
    let rows: Array<Row> = state.scheduleData.rows

    for (let i in rows) {
        subjects.add(rows[i].subject)
    }

    return Array.from(subjects)
}


export default scheduleDataSlice.reducer