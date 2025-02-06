import { newSubjects, selectSubjects } from "@/lib/features/ScheduleDataSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import ConfirmationPopup from "@/src/components/ConfirmationPopup"
import { Subject } from "@/types"
import { useEffect, useState } from "react"
import { SliderPicker } from "react-color"

export const EditSubjectPopup = (props: {setIsEditSubjectsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const subjects = useAppSelector(selectSubjects)
    
    const dispatch = useAppDispatch()
    const setSubjects: any = (val: Array<Subject>) => dispatch(newSubjects(val))

    const [currentSubject, setCurrentSubject] = useState<Subject>()
    const [newSubject, setNewSubject] = useState<Subject>({name: "", color: "#"})
    
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
    const [deleteConfirmationResult, setDeleteConfirmationResult] = useState(false)
    
    const [isFinishConfirmationOpen, setIsFinishConfirmationOpen] = useState(false)
    const [finishConfirmationResult, setFinishConfirmationResult] = useState(false)

    const [subjectSearch, setSubjectSearch] = useState("")

    useEffect(() => {
        if (deleteConfirmationResult && isDeleteConfirmationOpen) {
            setIsDeleteConfirmationOpen(false)

            setSubjects([...subjects].filter((subject) => (subject != currentSubject)))
            setCurrentSubject(undefined)
            setNewSubject({name: "", color: "#000000"})
            setDeleteConfirmationResult(false)
        } else if (finishConfirmationResult && isFinishConfirmationOpen) {
            setIsFinishConfirmationOpen(false)
            if (!currentSubject) {
                setSubjects([...subjects, newSubject])
            } else {
                setSubjects([...subjects].map((subject) => (subject.name === currentSubject.name ? newSubject : subject)))
            }
            setCurrentSubject(newSubject)
            setFinishConfirmationResult(false)
        }
    }, [deleteConfirmationResult, finishConfirmationResult, newSubject])

    
    return (
        <div className="shade" onClick={() => props.setIsEditSubjectsOpen(false)}>
            <div className="edit-subjects-container" onClick={(e) => e.stopPropagation()}>
                {isDeleteConfirmationOpen && 
                    <ConfirmationPopup setConfirmationResult={setDeleteConfirmationResult} close={() => setIsDeleteConfirmationOpen(false)}>
                        <h3>Delete Subject: {currentSubject && currentSubject?.name.charAt(0).toUpperCase() + currentSubject?.name.slice(1)}?</h3>
                        <p>Subject assignment will not be erased, but subject data will. This subject will be filterable as "None".</p>
                    </ConfirmationPopup>}
                {isFinishConfirmationOpen && 
                    <ConfirmationPopup setConfirmationResult={setFinishConfirmationResult} close={() => setIsFinishConfirmationOpen(false)}>
                        <h3>Finish Working on Subject: {newSubject?.name.charAt(0).toUpperCase() + newSubject?.name.slice(1)}?</h3>
                    </ConfirmationPopup>}
                <h2>Subjects</h2>
                <div className="edit-subjects-content">
                    <div className='subjects-container'>
                        <div className='subjects-header'>
                            <textarea className="subjects-search choice-search search-input" onChange={(e) => setSubjectSearch(e.target.value)} value={subjectSearch} placeholder='Search ' />
                            <div className="column-choice-element add-btn sticky top-0" onClick={() => {setCurrentSubject(undefined); setNewSubject({name: "", color: "#000000"})}}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                            </div>
                        </div>
                        <div className='subjects'>   
                            {/* Subjects is a set */}
                            {[...subjects].map((subject: Subject) => {
                                if (subjectSearch.trim() !== "" && !subject.name.toLowerCase().includes(subjectSearch.trim().toLowerCase())) return
                                return (
                                    <div
                                        key={"import-subject-" + subject.name} 
                                        style={{
                                            borderColor: subject.color
                                        }}
                                        className={'subject'}
                                        onClick={() => {setCurrentSubject(subject); setNewSubject(subject)}}
                                    >
                                        {subject.name.slice(0, 1).toUpperCase() + subject.name.slice(1)}
                                    </div>
                            )})}
                        </div>
                    </div>
                    <div className="edit-subject-container">
                        <h3>{currentSubject ? "Edit " + currentSubject.name.slice(0, 1).toUpperCase() + currentSubject.name.slice(1) : "Add"}</h3> 
                        <div className='edit-subject-container-child'>
                            <div className="editting-container" style={{borderColor: newSubject ? newSubject.color : "black"}}>
                                <div className="editting-container-child">
                                    <h4>Name:</h4><textarea className="edit-subject-textarea choice-search search-input" onChange={(e) => {setNewSubject((prevNewSubject) => ({name: e.target.value.toLowerCase(), color: prevNewSubject.color}))}} value={newSubject.name} placeholder={currentSubject ? currentSubject.name : 'Name'} />
                                    <h4>Color: </h4>
                                    <SliderPicker color={ newSubject.color } onChange={(e: {hex: any}) => {setNewSubject((prevNewSubject) => ({name: prevNewSubject.name, color: e.hex}))}} className='color-picker' />
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div 
                                    className={'finish-subject-btn ' + 
                                        (!currentSubject && "w-full ") + 
                                        (newSubject.name.trim() !== "" && " highlight")} 
                                        onClick={() => (newSubject.name.trim() !== "" && setIsFinishConfirmationOpen(true))}>
                                            Confirm
                                </div>
                                {currentSubject && <div className='delete-subject-btn' onClick={() => setIsDeleteConfirmationOpen(true)}>Delete</div>}  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}