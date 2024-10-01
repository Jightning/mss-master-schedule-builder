import Selection from './Selection'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { selectFilter, selectSelections, selectSettings } from '@/lib/features/ScheduleDataSlice'

const SelectionColumn = () => {
    const dispatch = useAppDispatch()
    const selections = useAppSelector(selectSelections)

    const filter = useAppSelector(selectFilter)

    return ( 
        <div className='selections-column-container' key={1}>
            {selections && selections.map((selection) => (
                filter.selections.searchTerm === "" 
                || (selection.name.trim().toLowerCase()).includes(filter.selections.searchTerm.trim().toLowerCase())
                ? <div key={selection.id}><Selection selection={selection} selectionId={selection.id} /></div>
                : <></>
            ))}
        </div>
    )
}

export default SelectionColumn