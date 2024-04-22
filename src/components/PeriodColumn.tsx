import { For } from "solid-js";
import { createDroppable } from "@thisbeyond/solid-dnd";

const PeriodColumn = (props: 
    {
        teachers: Array<Record<string, any>>, 
        period: Record<string, any>,
        heights: any,
        className?: string
    }) => {
    
    return (
        <div class='period-column'>
            <div class='period-column-header'>{props.period.name}</div>
            <For each={props.teachers}>
                {(teacher, index) => {
                    // droppable object passes data via droppable.data
                    // ex. can access teacher index via droppable.data.teacherIndex
                    // first parameter is id
                    const droppable = createDroppable(
                        teacher.id + "-" + props.period.id,
                        {   periodId: props.period.id,
                            teacherIndex: index()   });
                    
                    return (
                        <div 
                            class="period-table-element"
                            style={{
                                height: `${props.heights[index()]}px`
                            }}
                            use:droppable>
                                        
                            <p>{teacher.classes[props.period.id].name}</p>
 
                        </div>
                    )
                }}
            </For>
        </div>
    );
};

export default PeriodColumn;