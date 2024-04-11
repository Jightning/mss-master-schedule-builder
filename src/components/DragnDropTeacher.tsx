import {
    DragDropProvider,
    DragDropSensors,
    DragOverlay,
    SortableProvider,
    createSortable,
    createDroppable,
    closestCenter,
} from "@thisbeyond/solid-dnd";
import { batch, createSignal, For, Component } from "solid-js";
import { createStore } from "solid-js/store";
  
const Sortable = (props: {item: any}) => {
    const sortable = createSortable(props.item);
    return (
        <div
            use:sortable
            class="sortable column-element border-solid border-2 m-auto"
            classList={{ "opacity-25": sortable.isActiveDraggable }}
        >
            {props.item}
        </div>
    );
};
  
const Column = (props: {id: any, items: any, className?: string, index: number}) => {
    const droppable = createDroppable(props.id);
    return (
        <div use:droppable class={props.className + " " + "column border-2 border-white"}>
            <div>
                Period {props.index}
            </div>
            <SortableProvider ids={props.items}>
                <For each={props.items}>{(item) => <Sortable item={item} />}</For>
            </SortableProvider>
        </div>
    );
};

const TeacherColumn = (props: {ids: any, teachers: any, className?: string}) => {
    const droppable = createDroppable("teachers");
    return (
        <div use:droppable class={props.className + " " + "column border-2 border-white"}>
            <div>
                Teachers
            </div>
            <SortableProvider ids={props.ids}>
                <For each={props.teachers}>{(item) => <Sortable item={item.name} />}</For>
            </SortableProvider>
        </div>
    );
}; 
  
const DragnDropTeacher: Component = () => {
    // data
    const [containers, setContainers] = createStore<Record<string, number[]>>({
        A: [1, 2, 3],
        B: [4, 5, 6],
        C: [7, 8, 9],
        D: [10, 11, 12],
        E: [13, 14, 15],
        F: [16, 17, 18],
        G: [19, 20, 21],
        H: [22, 23, 24],
        I: [25, 26, 27],
    });

    const [teachers, setTeachers] = createStore<Record<string, any>>([
        { name: "Mashburn", class: ["Comp Sci"], subject: "Math" }
    ])
    
    const containerIds = () => Object.keys(containers);
    const teacherIds = teachers.map((teacher: any) => teacher.name)

    const isContainer = (id: any) => containerIds().includes(id);

    const getContainer = (id: any) => {
        for (const [key, items] of Object.entries(containers)) {
            if (items.includes(id)) {
                return key;
            }
        }
    };
  
    const closestContainerOrItem = (draggable: any, droppables: any, context: any) => {
        const closestContainer = closestCenter(
            draggable,
            droppables.filter((droppable: any) => isContainer(droppable.id)),
            context
        );
        if (closestContainer) {
            const containerItemIds = containers[closestContainer.id];

            const closestItem = closestCenter(
                draggable,
                droppables.filter((droppable: any) =>
                    containerItemIds.includes(droppable.id)
                ),
                context
            );

            if (!closestItem) {
                return closestContainer;
            }
  
            if (getContainer(draggable.id) !== closestContainer.id) {
                const isLastItem =
                    containerItemIds.indexOf(closestItem.id as number) ===
                    containerItemIds.length - 1;
  
                if (isLastItem) {
                    const belowLastItem =
                        draggable.transformed.center.y > closestItem.transformed.center.y;
  
                    if (belowLastItem) {
                        return closestContainer;
                    }       
                }
            }

            return closestItem;
        }
    };
  
    const move = (draggable: any, droppable: any, onlyWhenChangingContainer = true, duplicate = false) => {
        const draggableContainer = getContainer(draggable.id);
        const droppableContainer = isContainer(droppable.id)
            ? droppable.id
            : getContainer(droppable.id);
  
        if (draggableContainer != droppableContainer || !onlyWhenChangingContainer) {
            const containerItemIds = containers[droppableContainer];
            let index = containerItemIds.indexOf(droppable.id);
            if (index === -1) index = containerItemIds.length;

            batch(() => {
                if (!duplicate) {
                    setContainers(draggableContainer, (items) =>
                        items.filter((item: any) => item !== draggable.id)
                    );
                }

                setContainers(droppableContainer, (items) => [
                    ...items.slice(0, index),
                    draggable.id,
                    ...items.slice(index),
                ]);
            });
        }
    };

  
    const onDragOver = ({ draggable, droppable }: any) => {
        console.log(draggable.id, droppable.id)
        if (draggable && droppable) {
            move(draggable, droppable);
        }
    };
  
    const onDragEnd = ({ draggable, droppable }: any) => {
        if (draggable && droppable) {
            move(draggable, droppable, false);
        }
    };

    let count = 0;
    
    return (
        <div class="">
            <DragDropProvider
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                collisionDetector={closestContainerOrItem}
            >
                <DragDropSensors />
                <TeacherColumn ids={teacherIds} teachers={teachers} className="teacher-column"/>
                <div class="periods-container">
                    <For each={containerIds()}>
                        {(key) => {
                            count += 1;
                            return  (
                                <Column index={count} id={key} items={containers[key]} className={"period-column column-" + count} />
                            )}}
                    </For>
                </div>

                <DragOverlay>
                    {(draggable) => <div class="sortable">{draggable.id}</div>}
                </DragOverlay>
            </DragDropProvider>
        </div>
    );
};

export default DragnDropTeacher