# Thisbeyond Solid JS Drag and Drop Information Guide 
Very little documentation

All drag/drop element must be inside a `<DragDropProvider>`\
There must also be a `<DragDropSensors />`

**Draggable components** are components whcih the user can drag.\
All draggable components must have `use:draggable`
draggable is defined as a variable like so:
    `const draggable = createDraggable(id, {})`

**Droppable components** are components which accept draggable components.\
All droppable components must have `use:droppable`
droppable is defined as a variable like so:
    `const droppable = createDroppable(id, {});`

**In both cases (createDroppable, createDraggable):**\
id is a user defined id
data (the second parameter -> {}) is an object storing any data the user wishes to include
id and data can be accessed like so:
droppable.id
droppable.data

They are accessed in **onDragEnd, onDragOver functions**.\
All functions mentioned right above are set as props in the `DragDropProvider`
All are called in their respective situations, and recieve droppable and draggable in an object.

```
const onDragOver = ({draggable, droppable}) => {
    console.log(draggable.data, droppable.data);
}
```

### Example:

```
<DragDropProvider
    onDragEnd={onDragEnd}
    onDragOver={onDragOver}>

    <DragDropSensors />

    <div use:draggable>Drag Me!</div>

    <div use:droppable></div>
</DragDropProvider>
```