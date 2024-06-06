import React from 'react'
import { useDroppable } from '@dnd-kit/core'


const Cover = ({ id, className }: { id: string, className?: string }) => {
    const {setNodeRef} = useDroppable({
        id: id,
        data: {
            id: id
        }
    })

    return (
        <div
            ref={setNodeRef} 
            id={id} 
            className={className}>.
        </div>
    )
}

export default Cover