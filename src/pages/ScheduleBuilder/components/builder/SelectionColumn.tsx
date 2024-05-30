import React from 'react'
import Selection from './Selection'
import { Selection as SelectionInterface } from '../../types'

const SelectionColumn = (props: { selections: Array<SelectionInterface> }) => {
    return ( 
        <div className='selections-column-container'>
            {props.selections && props.selections.map((selection) => (
                <div key={selection.id}><Selection selection={selection} /></div>
            ))}
        </div>
    )
}

export default SelectionColumn