import {
    DragDropProvider,
    DragDropSensors,
    DragOverlay,
    SortableProvider,
    createSortable,
    createDroppable,
    closestCenter,
} from "@thisbeyond/solid-dnd";
import { batch, createSignal, For, Component, onMount, createEffect } from "solid-js";
import { createStore } from "solid-js/store";

import PeriodSchedule from "./PeriodSchedule";
import TeacherColumn from "./TeacherColumn";

const DnDTeacher = () => {
    const [teachers, setTeachers] = createStore<Array<Record<string, any>>>([
        { name: "A. Mashburnafdasdasdsadddddddddddddddddddddddddddddddddddddddddddddddddddddd", subject: "math", id: 10394 },
        { name: "B. Mashburn", subject: "math", id: 10324 },
        { name: "C. Mashburn", subject: "math", id: 10395 },
        { name: "D. Mashburn", subject: "math", id: 10396 },
        { name: "E. Mashburn", subject: "math", id: 10397 },
        { name: "F. Mashburn", subject: "math", id: 10398 },
        { name: "G. Mashburn", subject: "math", id: 10399 },
        { name: "H. Mashburn", subject: "math", id: 10320 },
        { name: "I. Mashburn", subject: "math", id: 10349 },
    ]);

    const [periods, setPeriods] = createStore<Array<Record<string, any>>>([
        { name: "Period 1", id: 1, available_classes: ["Comp Sci"] },
        { name: "Period 2", id: 2, available_classes: ["Comp Sci"] },
        { name: "Period 3", id: 3, available_classes: ["Comp Sci"] },
        { name: "Period 4", id: 4, available_classes: ["Comp Sci"] },
        { name: "Period 5", id: 5, available_classes: ["Comp Sci"] },
        { name: "Period 6", id: 6, available_classes: ["Comp Sci"] },
        { name: "Period 7", id: 7, available_classes: ["Comp Sci"] },
        { name: "Period 8", id: 8, available_classes: ["Comp Sci"] },
        { name: "Period 9", id: 9, available_classes: ["Comp Sci"] }
    ]);

    const [classes, setClass] = createStore<Array<Record<string, any>>>([
        { name: "Comp Sci", id: 33437 }
    ]);

    const [heights, setHeights] = createSignal([]);
    
    createEffect(() => {
        let allHeights: any = []
        teachers.forEach((teacher) => {
            const element = document.getElementById(`row-id-${teacher.id}`)
            allHeights.push(element?.offsetHeight)
            console.log(element?.offsetHeight)
        })  
        setHeights(allHeights)
    }, [teachers])
    


    return (
        <div class="dnd-teacher-container">
            <TeacherColumn teachers={teachers} />

            <PeriodSchedule teachers={teachers}
                            periods={periods}
                            heights={heights()}/>

            <div class="class-column">
                <div class="school-class-header">Classes</div>
                <For each={classes}>
                    {(schoolClass, index) => {
                        return (
                            <div class="school-class">{schoolClass.name}</div>
                        )
                    }}
                </For>
            </div>
        </div>
    );
};

export default DnDTeacher