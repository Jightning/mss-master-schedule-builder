import {
    DragDropProvider,
    DragDropSensors,
    DragOverlay,
    SortableProvider,
    createSortable,
    createDroppable,
    closestCenter,
} from "@thisbeyond/solid-dnd";
import { createSignal, createEffect, batch } from "solid-js";
import { createStore } from "solid-js/store";

import PeriodSchedule from "./PeriodSchedule";
import TeacherColumn from "./TeacherColumn";
import SchoolClassList from "./SchoolClassList";
import DragnDropTeacher from "./DragnDropTeacher";

const DnDTeacher = () => {
    const [teachers, setTeachers] = createSignal<Array<Record<string, any>>>([
        { name: "A. Mashburnafdasdasdsadddddddddddddddddddddddddddddddddddddddddddddddddddddd", subject: "math", id: 10394, classes: {"period_1": {name: "none"}, "period_2": {name: "none"}, "period_3": {name: "none"}, "period_4": {name: "none"}, "period_5": {name: "none"}, "period_6": {name: "none"}, "period_7": {name: "none"}, "period_8": {name: "none"}, "period_9": {name: "none"}} },
        { name: "B. Mashburn", subject: "math", id: 10324, classes: {"period_1": {name: "none"}, "period_2": {name: "none"}, "period_3": {name: "none"}, "period_4": {name: "none"}, "period_5": {name: "none"}, "period_6": {name: "none"}, "period_7": {name: "none"}, "period_8": {name: "none"}, "period_9": {name: "none"}} },
        { name: "C. Mashburn", subject: "math", id: 10395, classes: {"period_1": {name: "none"}, "period_2": {name: "none"}, "period_3": {name: "none"}, "period_4": {name: "none"}, "period_5": {name: "none"}, "period_6": {name: "none"}, "period_7": {name: "none"}, "period_8": {name: "none"}, "period_9": {name: "none"}} },
        { name: "D. Mashburn", subject: "math", id: 10396, classes: {"period_1": {name: "none"}, "period_2": {name: "none"}, "period_3": {name: "none"}, "period_4": {name: "none"}, "period_5": {name: "none"}, "period_6": {name: "none"}, "period_7": {name: "none"}, "period_8": {name: "none"}, "period_9": {name: "none"}} },
        { name: "E. Mashburn", subject: "math", id: 10397, classes: {"period_1": {name: "none"}, "period_2": {name: "none"}, "period_3": {name: "none"}, "period_4": {name: "none"}, "period_5": {name: "none"}, "period_6": {name: "none"}, "period_7": {name: "none"}, "period_8": {name: "none"}, "period_9": {name: "none"}} },
        { name: "F. Mashburn", subject: "math", id: 10398, classes: {"period_1": {name: "none"}, "period_2": {name: "none"}, "period_3": {name: "none"}, "period_4": {name: "none"}, "period_5": {name: "none"}, "period_6": {name: "none"}, "period_7": {name: "none"}, "period_8": {name: "none"}, "period_9": {name: "none"}} },
        { name: "G. Mashburn", subject: "math", id: 10399, classes: {"period_1": {name: "none"}, "period_2": {name: "none"}, "period_3": {name: "none"}, "period_4": {name: "none"}, "period_5": {name: "none"}, "period_6": {name: "none"}, "period_7": {name: "none"}, "period_8": {name: "none"}, "period_9": {name: "none"}} },
        { name: "H. Mashburn", subject: "math", id: 10320, classes: {"period_1": {name: "none"}, "period_2": {name: "none"}, "period_3": {name: "none"}, "period_4": {name: "none"}, "period_5": {name: "none"}, "period_6": {name: "none"}, "period_7": {name: "none"}, "period_8": {name: "none"}, "period_9": {name: "none"}} },
        { name: "I. Mashburn", subject: "math", id: 10349, classes: {"period_1": {name: "none"}, "period_2": {name: "none"}, "period_3": {name: "none"}, "period_4": {name: "none"}, "period_5": {name: "none"}, "period_6": {name: "none"}, "period_7": {name: "none"}, "period_8": {name: "none"}, "period_9": {name: "none"}} },
    ]);

    const [periods, setPeriods] = createSignal<Array<Record<string, any>>>([
        { name: "Period 1", id: "period_1", available_classes: ["Comp Sci"] },
        { name: "Period 2", id: "period_2", available_classes: ["Comp Sci"] },
        { name: "Period 3", id: "period_3", available_classes: ["Comp Sci"] },
        { name: "Period 4", id: "period_4", available_classes: ["Comp Sci"] },
        { name: "Period 5", id: "period_5", available_classes: ["Comp Sci"] },
        { name: "Period 6", id: "period_6", available_classes: ["Comp Sci"] },
        { name: "Period 7", id: "period_7", available_classes: ["Comp Sci"] },
        { name: "Period 8", id: "period_8", available_classes: ["Comp Sci"] },
        { name: "Period 9", id: "period_9", available_classes: ["Comp Sci"] }
    ]);

    const [schoolClasses, setSchoolClass] = createSignal<Array<Record<string, any>>>([
        { name: "Comp Sci", id: 33437 },
        { name: "AP Physics 1", id: 33438 },
    ]);

    // Array of row heights to simulate table visual
    const [heights, setHeights] = createSignal([]);

    // Returns teacher index in teachers array based on name
    const findTeacher = (name: string) => {
        for (let i = 0; i < teachers().length; i++) {
            const teacher = teachers()[i]
            if (teacher.name === name) {
                return i
            }
        }
        return -1
    }
    
    createEffect(() => {
        let allHeights: any = []
        // Set all heights based on teacher row height
        teachers().forEach((teacher) => {
            const teacherElement = document.getElementById(`row-id-${teacher.id}`)
            allHeights.push(teacherElement?.offsetHeight)
            console.log(teacherElement?.offsetHeight)
        })  
        setHeights(allHeights)
    }, [teachers])
    
    // When user drops droppable component
    const onDragEnd = ({ draggable, droppable }: any) => {
        if (draggable && droppable) {
            // Adding draggable class data to droppable
            setTeachers((prevTeachers: any) => {
                // Identifying index of the teacher to change
                // const toChange = findTeacher(droppable.data.teacher.name)
                const toChange = droppable.data.teacherIndex;
                // Id of period to change
                const periodId = droppable.data.periodId
                // pass by value -> cannot return reference, otherwise values will not rerender correctly
                // Teacher object to change
                let teacher = {...prevTeachers[toChange]}

                // teacher.classes[periodId] is the school class to change

                // setting school class of respective teacher in respective period to draggable school class
                teacher.classes[periodId] = draggable.data.schoolClass

                return [...prevTeachers.slice(0, toChange), 
                        teacher, 
                        ...prevTeachers.slice(toChange + 1)];


                /*
                // Alt option:
                return [...prevTeachers.slice(0, toChange), 
                        {...droppable.data.teacher, 
                                classes: {...droppable.data.teacher.classes, 
                                        [classIndex]: {
                                                ...droppable.data.teacher.classes[classIndex],
                                                name: draggable.data.schoolClass.name}}}, 
                        ...prevTeachers.slice(toChange + 1)];
                */
            })
        }
    }

    // When user hovers over droppable components
    const onDragOver = ({ draggable, droppable }: any) => {
        console.log("hello", droppable, draggable)
    }

    return (
        <div class="dnd-teacher-container">
            <DragDropProvider 
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}>
                <DragDropSensors />

                <TeacherColumn teachers={teachers()} />
    
                <PeriodSchedule 
                            teachers={teachers()}
                            periods={periods()}
                            heights={heights()}/>

                <SchoolClassList schoolClasses={schoolClasses()}/>
            </DragDropProvider> 
        </div>
    );
};

export default DnDTeacher