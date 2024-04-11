import { For } from "solid-js";

const PeriodSchedule = (props: 
    {
        teachers: Array<Record<string, any>>, 
        periods: Array<Record<string, any>>, 
        heights: Array<any>,
        className?: string
    }) => {

    return (
        <div class={'period-table' + " " + props.className}>
            <For each={props.periods}>
                {(period, tIndex) => (
                    <div class='period-column'>
                        <div class='period-column-header'>{period.name}</div>
                        <For each={props.teachers}>
                            {(teacher, pIndex) => {
                                return (
                                    <div 
                                        class="period-table-element"
                                        style={{
                                            height: `${props.heights[pIndex()] }px`
                                        }}>
                                        X
                                    </div>
                                )
                            }}
                        </For>
                    </div>
                )}  
            </For>
        </div>
    );
};

export default PeriodSchedule;