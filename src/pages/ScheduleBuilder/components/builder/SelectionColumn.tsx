import React from 'react'
import Selection from './Selection'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { selectSelections } from '@/lib/features/ScheduleDataSlice'

const SelectionColumn = () => {
    const dispatch = useAppDispatch()
    const selections = useAppSelector(selectSelections)

    return ( 
        <div className='selections-column-container'>
            {selections && selections.map((selection) => (
                <div key={selection.id}><Selection selection={selection} selectionId={selection.id} /></div>
            ))}
        </div>
    )
}

export default SelectionColumn