import { For, createMemo, mergeProps } from "solid-js";
import { createDroppable, SortableProvider, createSortable } from "@thisbeyond/solid-dnd";
import PeriodColumn from "./PeriodColumn";

const PeriodSchedule = (props: 
    {
        teachers: Array<Record<string, any>>, 
        periods: Array<Record<string, any>>,
        heights: Array<any>,
        className?: string
    }) => {

    return (
        <div class={'period-table' + " " + props.className}>
            {/*For each period column, generate a value per teacher*/}
            <For each={props.periods}>
                {(period, index) => {
                    return (
                        <PeriodColumn 
                            teachers={props.teachers}
                            period={period}
                            heights={props.heights}/>
                )}}
            </For>
        </div>
    );
};

export default PeriodSchedule;