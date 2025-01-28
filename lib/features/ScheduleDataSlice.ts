import { createSlice } from '@reduxjs/toolkit'
import {
    Column,
    Row,
    Selection,
    Filter,
    Settings,
    ScheduleBuilderAction,
    Subject
} from "@/types"
import { defaultSelection, modifyRows } from "./Utilities"
// TODO The import by JSON replaces everything instead of adding on

interface InitialStateType {
    settings: Settings,
    filter: Filter,
    rows: Array<Row>,
    columns: Array<Column>,
    selections: Array<Selection>,
    subjects: Array<Subject>,
    history: Array<{message: string, rows: Array<Row>, columns: Array<Column>}>,
    currentStep: number
}

const defaultSettings: Settings = {
    isOddEvenToggle: true,
    isOddEvenAutoAssign: false,
    hasSelectionLimit: true,
    selectionLimit: 1,
    isCopySelection: false,
    isColorSelectionSubjects: false,
    isColorRowSubjects: false,
}

const defaultFilter: Filter = {
    selections: {
        searchTerm: "",
        subjects: []
    },
    rows: {
        searchTerm: "",
        subjects: []
    }
}

const initialState: InitialStateType = 
{
    settings: JSON.parse(localStorage.getItem("settings") ?? "null") ?? defaultSettings,
    filter: JSON.parse(localStorage.getItem("filter") ?? "null") ?? defaultFilter,
    rows: JSON.parse(localStorage.getItem("rows") ?? "null") ?? [],
    // rows: [{ name: "A. Teacher", subject: "math", id: '10394', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },],
    // rows: [
    //     { name: "A. Teacher", subject: "math", id: '10394', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    //     { name: "B. Teacher", subject: "science", id: '10324', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    //     { name: "CB. Teacher", subject: "english", id: '101101', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    //     { name: "C. Teacher", subject: "math", id: '10395', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    //     { name: "D. Teacher", subject: "science", id: '10396', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    //     { name: "D. LongTeacherNameHereLongTeacherNameHereLongTeacherNameHereLongTeacherNameHere", subject: "math", id: '103446', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    //     { name: "E. Teacher", subject: "math", id: '10397', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    //     { name: "F. Teacher", subject: "math", id: '10398', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    //     { name: "G. Teacher", subject: "english", id: '10399', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    //     { name: "H. Teacher", subject: "math", id: '10320', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    //     { name: "I. Teacher", subject: "english", id: '10349', selectionCount: 0, columns: {"period_1": defaultSelection, "period_2": defaultSelection, "period_3": defaultSelection, "period_4": defaultSelection, "period_5": defaultSelection, "period_6": defaultSelection, "period_7": defaultSelection, "period_8": defaultSelection, "period_9": defaultSelection} },
    // ],
    columns: JSON.parse(localStorage.getItem("columns") ?? "null") ?? [],
    // columns: [{ name: "Period 1", id: "period_31", oddEven: false},],
    // columns: [
    //     { name: "Period 1", id: "period_1", oddEven: false},
    //     { name: "Period 2", id: "period_2", oddEven: false},
    //     { name: "Period 3", id: "period_3", oddEven: false},
    //     { name: "Period 4", id: "period_4", oddEven: false},
    //     { name: "Period 5", id: "period_5", oddEven: false},
    //     { name: "Period 6", id: "period_6", oddEven: false},
    //     { name: "Period 7", id: "period_7", oddEven: false},
    //     { name: "Period 8", id: "period_8", oddEven: false},
    //     { name: "Period 9", id: "period_9", oddEven: false}
    // ],
    selections: JSON.parse(localStorage.getItem("selections") ?? "null") ?? [],
    // selections: [{ name: "Computer Science", subject: "math", id: '33437' }],
    // selections: [
    //     { name: "Computer Science", subject: "math", id: '33437' },
    //     { name: "AP Physics 1", subject: "science", id: '3343855' },
    //     { name: "AP Physics 2", subject: "science", id: '334348' },
    //     { name: "AP English Literature", subject: "english", id: '3343238' },
    //     { name: "Economics", subject: "science", id: '3343328' },
    //     { name: "AP Physics 6", subject: "science", id: '3343068' },
    //     { name: "AP Physics 7", subject: "science", id: '334398' },
    //     { name: "AP Physics 8", subject: "science", id: '334868' },
    //     { name: "AP Physics 9", subject: "science", id: '334548' },
    //     { name: "A", subject: "english", id: '130039239' },
    //     { name: "AP Physics 100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", subject: "science", id: '332448' },
    //     { name: "AP Physics 11", subject: "science", id: '33443' },
    //     { name: "AP Physics 12", subject: "science", id: '33428' },
    //     { name: "AP Physics 13", subject: "science", id: '33438' },
    //     { name: "AP Physics 14", subject: "science", id: '33238' },
    //     { name: "AP Physics 15", subject: "science", id: '324238' },
    //     { name: "AP Physics 16", subject: "science", id: '33644238' },
    //     { name: "AP Physics 17", subject: "science", id: '33425693832' },
    //     { name: "AP Physics 18", subject: "science", id: '3342385471'},
    //     { name: "AP Physics 19", subject: "science", id: '3342342532812' },
    //     { name: "AP Physics 20", subject: "science", id: '33423064223228' },
    //     { name: "AP Physics 21", subject: "science", id: '3342934228054' },
    //     { name: "AP Physics 22", subject: "science", id: '334623422807' },
    //     { name: "AP Physics 23", subject: "science", id: '3342342285708' },
    //     { name: "AP Physics 24", subject: "science", id: '3342342228' },
    //     { name: "AP Physics 25", subject: "science", id: '334234282234' },
    //     { name: "AP Physics 26", subject: "science", id: '3342342854' },
    //     { name: "AP Physics 27", subject: "science", id: '3342322876' },
    //     { name: "AP Physics 28", subject: "science", id: '3342422818' },
    //     { name: "AP Physics 29", subject: "science", id: '3342422828' },
    //     { name: "AP Physics 30", subject: "science", id: '3342422838' },
    //     { name: "AP Physics 31", subject: "science", id: '332422848' },
    //     { name: "AP Physics 32", subject: "science", id: '3342422858' },
    //     { name: "AP Physics 33", subject: "science", id: '33424228786' },
    //     { name: "AP Physics 34", subject: "science", id: '3342422868' },
    //     { name: "AP Physics 35", subject: "science", id: '3342422878' },
    //     { name: "AP Physics 36", subject: "science", id: '3342422888' },
    //     { name: "AP Physics 37", subject: "science", id: '3342422898' },
    //     { name: "AP Physics 38", subject: "science", id: '33424228108' },
    //     { name: "AP Physics 39", subject: "science", id: '33424228118' }
    // ],
    subjects: JSON.parse(localStorage.getItem("subjects") ?? "null") ?? [{name: "none", color: "#000000"}],
    // subjects: [{name: "math", color: "#EB144C"}, {name: "english", color: "#FCB900"}, {name: "science", color: "#00D084"}],
    history: [],
    // settingsHistory: [{...defaultSettings, step: -1}],
    currentStep: -1
}

export const scheduleDataSlice = createSlice({
    name: 'Schedule Data',
    initialState,
    reducers: {
        newSettings: (state, action) => {
            state.settings = action.payload
            localStorage.setItem("settings", JSON.stringify(state.settings))
            // state.settingsHistory.push({...state.settings, step: state.currentStep})
        },
        newFilter: (state, action) => {
            state.filter = action.payload
            localStorage.setItem("filters", JSON.stringify(state.filter))
        },
        newRows: (state, action: {payload: Array<Row>}) => {
            state.rows = action.payload
            localStorage.setItem("rows", JSON.stringify(state.rows))
        },
        newColumns: (state, action: {payload: Array<Column>}) => {
            state.columns = action.payload
            localStorage.setItem("columns", JSON.stringify(state.columns))
        },
        newSelections: (state, action: {payload: Array<Selection>}) => {
            state.selections = action.payload
            localStorage.setItem("selections", JSON.stringify(state.selections))
        },
        newSubjects: (state, action: {payload: Array<Subject>}) => {
            state.subjects = Array.from(new Set(action.payload))
            localStorage.setItem("subjects", JSON.stringify(state.subjects))
        },
        // History Reducers  
        // BUG when setting autoassign and using it to split something, then moving the things, then disabling autoassign and then enabling copy selection to then replace on the of the things with the other, it wont work
        addState: (state, action: {payload: ScheduleBuilderAction}) => {
            const modifications = modifyRows(action.payload, state.rows, state.columns, state.settings)
            if (modifications.failed) {
                return
            }

            const count = modifications.rows[action.payload.action.toChange]?.selectionCount
            
            if (count > state.settings.selectionLimit && state.settings.hasSelectionLimit && !action.payload.type.includes("DELETE")) {
                return
            }

            state.rows = modifications.rows
            state.columns = modifications.columns
            if (modifications.selections) state.selections = modifications.selections

            localStorage.setItem("selections", JSON.stringify(state.columns))
            localStorage.setItem("rows", JSON.stringify(state.rows))
            localStorage.setItem("columns", JSON.stringify(state.columns))

            if (!action.payload.action.ignoreHistory)
                state.history = [...state.history.slice(0, state.currentStep + 1), {message: action.payload.message || "Unknown", rows: modifications.rows, columns: modifications.columns}]

            state.currentStep = state.history.length - 1
        },
        // payload represents the history step to go back to ( if its 1, go until currentStep is 1)
        undoState(state, action: {payload?: {step: number}}) {
            console.log(action.payload)
            while (action.payload?.step !== state.currentStep) {
                if (state.currentStep > 0) {
                    state.currentStep--;

                    const currentState = state.history[state.currentStep]

                    state.rows = currentState.rows
                    state.columns = currentState.columns

                } else if (state.currentStep === 0) {
                    state.currentStep--;

                    state.rows = initialState.rows
                    state.columns = initialState.columns
                    state.settings = initialState.settings

                    break
                }

                if (!action.payload) break
            }

            localStorage.setItem("selections", JSON.stringify(state.columns))
            localStorage.setItem("rows", JSON.stringify(state.rows))
            localStorage.setItem("columns", JSON.stringify(state.columns))
        },
        redoState(state, action: {payload?: {step: number}}) {
            console.log(action, state.currentStep)
            while (action.payload?.step !== state.currentStep) {
                if (state.currentStep < state.history.length - 1) {
                    state.currentStep++;

                    const currentState = state.history[state.currentStep]

                    state.rows = currentState.rows
                    state.columns = currentState.columns
                }

                if (!action.payload) break
            }
        },
        resetHistory(state) {
            state.history = [];
            // state.settingsHistory = []
            state.currentStep = -1;
        }
    },
})

export const { newRows, newColumns, newSelections, newFilter, newSettings, newSubjects } = scheduleDataSlice.actions
export const { addState, undoState, redoState, resetHistory } = scheduleDataSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectRows = (state: { scheduleData: { rows: Array<Row> } }) => state.scheduleData.rows
export const selectColumns = (state: { scheduleData: { columns: Array<Column> }}) => state.scheduleData.columns
export const selectSelections = (state: { scheduleData: { selections: Array<Selection> }}) => state.scheduleData.selections
export const selectSubjects = (state: { scheduleData: { subjects: Array<Subject> } }) => state.scheduleData.subjects

export const selectFilter = (state: { scheduleData: { filter: Filter } }) => state.scheduleData.filter
export const selectSettings = (state: { scheduleData: { settings: Settings } }) => state.scheduleData.settings

export const selectCurrentStep = (state: { scheduleData: { currentStep: number } }) => state.scheduleData.currentStep
export const selectHistory = (state: { scheduleData: { history: Array<{message: string, rows: Array<Row>, columns: Array<Column>}> } }) => state.scheduleData.history


export default scheduleDataSlice.reducer