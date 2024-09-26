import React from 'react'
import Selection from './Selection'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { selectFilter, selectSearchTerm, selectSelections } from '@/lib/features/ScheduleDataSlice'

const SelectionColumn = () => {
    const dispatch = useAppDispatch()
    const selections = useAppSelector(selectSelections)

    const filter = useAppSelector(selectFilter)
    const searchTerm = useAppSelector(selectSearchTerm)

    return ( 
        <div className='selections-column-container'>
            {selections && selections.map((selection) => (
                searchTerm === "" || (filter.searchLocation === "selections" && (selection.name.trim().toLowerCase()).includes(searchTerm.trim().toLowerCase()))
                ? <div key={selection.id}><Selection selection={selection} selectionId={selection.id} /></div>
                : <></>
            ))}
        </div>
    )
}

export default SelectionColumn