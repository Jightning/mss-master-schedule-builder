import React from 'react'
import { useDroppable } from '@dnd-kit/core'

const Trash = () => {
    const {setNodeRef, isOver} = useDroppable({
        id: "trash-droppable"
    })

    return (
        <div className="trash" ref={setNodeRef}>
            <span className={'trash-lid ' + (isOver ? "lifting-lid" : "")}>
                <svg viewBox="15 10 70 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M80,20L60,20L60,15C60,12.239,57.761,10,55,10L45,10C42.239,10,40,12.239,40,15L40,20L20,20C17.239,20,15,22.239,15,25L15,30L85,30L85,25C85,22.239,82.761,20,80,20ZM45,20L45,15L55,15L55,20L45,20Z" stroke="none"/>
                </svg>
            </span>
            <span className='trash-base'>
                <svg viewBox="20 35 60 55" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,90L80,90L80,35L20,35L20,90ZM65,40L70,40L70,85L65,85L65,40ZM47.5,40L52.5,40L52.5,85L47.5,85L47.5,40ZM30,40L35,40L35,85L30,85L30,40Z" stroke="none"/>
                </svg>
            </span>
        </div>
    )
}

export default Trash