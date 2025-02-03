import { redoState, selectCurrentStep, selectHistory, undoState } from "@/lib/features/ScheduleDataSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useEffect, useRef } from "react"

export const UndoPopup = (props: {closePopup: any}) => {
    const undoRef = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()
    const currentStep = useAppSelector(selectCurrentStep)
    const history = useAppSelector(selectHistory)

    const undo: any = (val?: any) => dispatch(undoState(val))
    
    // Just in case -> Should already be covered by the onClick
    useEffect(() => {
        if (currentStep === -1) {
            props.closePopup()
        }
    }, [currentStep])

    useEffect(() => {
        // To close the filter dropdown when the user clicks outside of it
        const handleClickOutside = (event: any) => {
            const undo_btn = document.getElementById("undo-btn")
            if (undoRef.current && !undoRef.current.contains(event.target) && event.target !== undo_btn && !undo_btn?.contains(event.target)) {
                props.closePopup();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);   

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="undoredo-context-menu" ref={undoRef}>
            {history && [...history].reverse().map((hist, i) => {
                const index = history.length - i - 1
                if (currentStep > index)
                return (
                    <div onClick={() => {undo({step: index})}} className="history-item">
                        <p className="history-text">{hist.message}</p>
                    </div>
                )
            })}
            <div onClick={() => {
                undo({step: -1});
                if (currentStep === -1) props.closePopup()
            }} className="history-item">
                <p className="history-text">Original State</p>
            </div>
        </div>
    )
}

export const RedoPopup = (props: {closePopup: any}) => {
    const redoRef = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()
    const currentStep = useAppSelector(selectCurrentStep)
    const history = useAppSelector(selectHistory)

    const redo: any = (val?: any) => dispatch(redoState(val))

    // Just in case -> Should already be covered by the onClick
    useEffect(() => {
        if (currentStep === history.length - 1) {
            props.closePopup()
        }
    }, [currentStep])

    useEffect(() => {
        // To close the filter dropdown when the user clicks outside of it
        const handleClickOutside = (event: any) => {
            const redo_btn = document.getElementById("redo-btn")
            if (redoRef.current && !redoRef.current.contains(event.target) && event.target !== redo_btn && !redo_btn?.contains(event.target)) {
                props.closePopup();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);   

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="undoredo-context-menu" ref={redoRef} style={{marginLeft: "34px"}}>
            {history && [...history].map((hist, index) => {
                if (currentStep < index)
                return (
                    <div onClick={() => {
                            redo({step: index}); 
                            if (currentStep === history.length - 1) props.closePopup()
                        }} className="history-item">
                            <p className="history-text">{hist.message}</p>
                    </div>
                )
            })}
        </div>
    )
}