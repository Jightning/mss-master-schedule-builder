import { selectFilter, newFilter, newRows, selectRows } from '@/lib/features/ScheduleDataSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { Filter, Row } from '@/types'
import { useEffect } from 'react'

const SearchBar = ({ searchLocation }: { searchLocation: string }) => {
    const dispatch = useAppDispatch()

    const filter = useAppSelector<Filter>(selectFilter)
    const setFilter: any = (val: string) => dispatch(newFilter(val))

    const rows = useAppSelector<Array<Row>>(selectRows)
    const setRows: any = (val: Array<Row>) => dispatch(newRows(val))

    useEffect(() => {
        const searchBar = document.getElementById('search-input');

        searchBar?.addEventListener('keydown', function(event) {
        if (event.ctrlKey && (event.key === 'z' || event.key === "y")) {
            event.preventDefault();
        }
        });
    })

    const handleChange = (e: any) => {
        // V-V
        // Could use type assertion to access filter[filterLocation], but selections and rows might be different
        // TODO Check later, if they are not different, just use type assertion
        setFilter({...filter, [searchLocation]: 
            {...filter[searchLocation as keyof typeof filter], searchTerm: e.target.value}})
        setRows([...rows])
    }

    return (
        <div>
            <textarea className="search-input" onChange={handleChange} value={filter[searchLocation as keyof typeof filter].searchTerm} placeholder='Search' />
            <div className="erase-search-icon" onClick={() => {setFilter({...filter, [searchLocation]: {...filter[searchLocation as keyof typeof filter], searchTerm: ""}}); setRows([...rows]);}}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>
        </div>
    )
}

export default SearchBar