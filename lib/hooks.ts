import { useDispatch, useSelector, useStore, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch, AppStore } from './store'
import { newRows, newColumns, newSelections } from './features/ScheduleDataSlice'
import type { Column, Row } from '@/types'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore: () => AppStore = useStore

// const dispatch = useAppDispatch();
// export const setRows = (newRowsArray: Row[]) => dispatch(newRows(newRowsArray))
// export const setColumns = (newColumnsArray: Column[]) => dispatch(newColumns(newColumnsArray))
// export const setSelections = (newSelectionsArray: Selection[]) => dispatch(newSelections(newSelectionsArray))