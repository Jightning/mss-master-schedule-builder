import { selectSearchTerm, newSearchTerm } from '@/lib/features/ScheduleDataSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

const SearchBar = () => {
    const dispatch = useAppDispatch()

    const searchTerm = useAppSelector(selectSearchTerm)
    const setSearchTerm: any = (val: string) => dispatch(newSearchTerm(val))

    const handleChange = (e: any) => {
        setSearchTerm(e.target.value)
    }

    return (
        <div>
            <textarea id="search-input" onChange={handleChange} value={searchTerm} placeholder='Search' />
            <div className="erase-search-icon" onClick={() => setSearchTerm("")}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>
        </div>
    )
}

export default SearchBar