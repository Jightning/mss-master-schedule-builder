import { AccessorArray, For } from "solid-js";
import { createDraggable } from "@thisbeyond/solid-dnd";

const SchoolClassList = (props: 
    {
        schoolClasses: Array<Record<string, any>>, 
        className?: string
    }) => {
    
    return (
        <div class="class-column">
            <div class="school-class-header">Classes</div>
            <For each={props.schoolClasses}>
                {(schoolClass, index) => {
                    const draggable = createDraggable(schoolClass.id, {schoolClass: schoolClass});
                    
                    return (
                        <div 
                            class="school-class"
                            use:draggable>

                                {schoolClass.name}

                        </div>
                    )
                }}
            </For>
        </div>
    );
};

export default SchoolClassList;