import { configureStore } from '@reduxjs/toolkit'
import ScheduleDataSlice from './features/ScheduleDataSlice'

export const makeStore = (_reducer = {}) => {
  return configureStore({
    reducer: {
      scheduleData: ScheduleDataSlice,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']