import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { selectCurrentStep, selectHistory } from '@/lib/features/ScheduleDataSlice'
import { undoState, redoState } from '@/lib/features/ScheduleDataSlice'
 
const UndoRedo = () => {
    const dispatch = useAppDispatch()
    const currentStep = useAppSelector(selectCurrentStep)
    const history = useAppSelector(selectHistory)

    const undo: any = () => dispatch(undoState())
    const redo: any = () => dispatch(redoState())

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.ctrlKey && event.key.toLowerCase() === "z") {
                undo()
            } else if (event.ctrlKey && event.key.toLowerCase() === "y") {
                redo()
            }
        }
        
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])
 
    
    return (
        <div className='undoredo-container'>
            <svg 
                onClick={() => undo()}
                className={'fill-black border-solid rounded-md ' + (currentStep < 0 ? " btn-disabled" : "")} 
                xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e8eaed"><path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/>
            </svg>
            <svg 
                onClick={() => redo()}
                className={"fill-black border-solid rounded-md " + (currentStep >= history.length - 1 ? " btn-disabled" : "")}
                xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e8eaed"><path d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z"/></svg>
        </div>
    )
}

export default UndoRedo