# Drag and Drop
> @dnd-kit/core\
https://dndkit.com/

> Drag and drop requires a `DndContext` as a parent element. Inside, a droppable component must be set up to allow draggable components to be dragged into them.

### DndContext
Props: `onDragEnd`, `onDragStart`, `modifiers`\
Allows the developer to instill conditions when the start and stop dragging. 

#### onDragStart:
Function which takes in draggable.\
Draggable looks like so:\
```
{
    active: {
        id: "DRAGGABLE_ID",
        data: {DATA},
        rect: {...}
    }
}
```
id and data are set up in the draggable component

#### onDragEnd:
Function which takes in an object representing draggable and droppable.\
Object looks like so:\
```
{
    active: {
        id: "DRAGGABLE_ID",
        data: {DATA},
        rect: {...}
    },
    collisions: [],
    delta: {x..., y..., scaleX..., scaleY...},
    over: {
        id: "DROPPABLE_ID",
        rect: Rect,
        data: {DATA},
        disabled: true/false
    }
}
```
id and data are set up in the draggable (active) and droppable (over) components

### Draggable Component
```
import { useDraggable } from '@dnd-kit/core'
import { CSS } from "@dnd-kit/utilities"

const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: "DRAGGABLE_ID",
    data: {DATA}
});

// Style for the movement of component
const style = {
    transform: CSS.Translate.toString(transform),
};
```
> Draggable Component must be set up with variables above as such:
```
return (
    <div className={'selection-container' + ' ' + props.classNames}
        id={"DRAGGABLE_ID"}
        ref={setNodeRef} 
        style={style} 
        {...listeners} 
        {...attributes}>

    </div>
)
```

### Droppable Component

```
import { useDroppable } from '@dnd-kit/core'

const {setNodeRef, isOver} = useDroppable({
    id: "DROPPABLE_ID",
    data: {DATA}
})

const style = {
    color: isOver ? "green" : undefined
}

return (
    <div
        ref={setNodeRef} 
        id={"DROPPABLE_ID"} 
        style={style} >

    </div>
)
```

### Overlay
```
import { DragOverlay } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

<DragOverlay dropAnimation={null} modifiers={[restrictToWindowEdges]}>
    {activeSelection ? (
        <Draggable />
    ): null}
</DragOverlay>
```
> Drag Overlay creates an overlay over the current draggable. Overlay is shown as whatever component is inside it. This component is only shown when the activeSelection condition is true, and will follow exactly where the mouse goes. **Prevents shifting due to scroll**. Will not; however, hide the original draggable and will istead go over it, this can be solved by changing the original draggable's opacity to 0.

# Draggable Scroll
> react-use-draggable-scroll\
https://github.com/rfmiotto/react-use-draggable-scroll

> Allow the user to scroll by dragging. Overflow must be set to scroll or auto

```
import { useDraggable } from "react-use-draggable-scroll";
import { useRef } from 'react';

const drag_scroll_ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
const { events } = useDraggable(drag_scroll_ref)

return (
    <div ref={drag_scroll_ref} {...events}>
        Scrollable here
    </div>
)
```