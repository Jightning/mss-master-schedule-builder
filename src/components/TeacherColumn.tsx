import { For } from "solid-js";

const TeacherColumn = (props: 
    {
        teachers: Array<Record<string, any>>, 
        className?: string
    }) => {

    return (
        <div class={'teacher-column' + " " + props.className}>
            <div class='teacher-column-header'>Teacher</div>
            <For each={props.teachers}>
                {(teacher, index) => {
                    return (
                        <div class="teacher-column-teacher" id={`row-id-${teacher.id}`}>{teacher.name}</div>
                    )
                }}
            </For>
        </div>
    );
};

export default TeacherColumn;