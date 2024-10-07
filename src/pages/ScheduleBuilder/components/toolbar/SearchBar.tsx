import { selectFilterLocation, selectFilter, newFilter, newRows, selectRows } from '@/lib/features/ScheduleDataSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { Filter, Row } from '@/types'

const SearchBar = () => {
    const dispatch = useAppDispatch()

    const filterLocation = useAppSelector(selectFilterLocation)

    const filter = useAppSelector<Filter>(selectFilter)
    const setFilter: any = (val: string) => dispatch(newFilter(val))

    const rows = useAppSelector<Array<Row>>(selectRows)
    const setRows: any = (val: Array<Row>) => dispatch(newRows(val))

    const handleChange = (e: any) => {
        // V-V. 
        // Could use type assertion to access fitler[filterLocation], but selections and rows might be different
        // Check later, if they are not different, just use type assertion
        setFilter({...filter, [filterLocation]: 
            {...filter[filterLocation as keyof typeof filter], searchTerm: e.target.value}})
        setRows([...rows])
    }

    return (
        <div>
            <textarea id="search-input" onChange={handleChange} value={filter[filterLocation as keyof typeof filter].searchTerm} placeholder='Search' />
            <div className="erase-search-icon" onClick={() => {setFilter({...filter, [filterLocation]: {...filter[filterLocation as keyof typeof filter], searchTerm: ""}}); setRows([...rows]);}}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>
        </div>
    )
}

export default SearchBar