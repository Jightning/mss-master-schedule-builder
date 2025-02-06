import Selection from './Selection'
import { useAppSelector } from '@/lib/hooks'
import { selectFilter, selectSelections } from '@/lib/features/ScheduleDataSlice'

const SelectionColumn = () => {
    const selections = useAppSelector(selectSelections)
    const filter = useAppSelector(selectFilter)

    return ( 
        <div className='selections-column-container' key={1}>
            {selections && selections.map((selection) => {return (
                (filter.selections.searchTerm === "" || 
                    (selection.name.trim().toLowerCase()).includes(filter.selections.searchTerm.trim().toLowerCase()))
                &&
                (filter.selections.subjects.length === 0 || 
                    filter.selections.subjects.includes(selection.subject))
                &&

                <div key={selection.id}>
                    <Selection selection={selection} selectionId={selection.id} />
                </div>
            )})}
        </div>
    )
}

export default SelectionColumn