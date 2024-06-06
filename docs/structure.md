# Schedule Builder
> src/pages/ScheduleBuilder

## Drag and Drop
> Look at dependencies docs -> drag and drop

Main table is comprised of `Rows`, and `ScheduleTable`.\
`ScheduleTable` maps through each column name, then each `Column`\
Each `Column` maps through each `row`, setting up a droppable with that row and columns `Selection`.\
On the right side exists the `SelectionColumn` which contains each `Selection` as a draggable

## Utilities
> Components to make ux better, and for 

### Cover
Props: `id`, `className`
> "Invisible" covers which block droppables. Easier to cover the left and right with a useless `droppable` so the user doesn't accidentally drop selection rather than manually disabling the other droppables.

### Trash
> Droppable with `trash-droppable` id which triggers the deletion of selection in table (not from selection column)

#### handleCollisions
Function used to ensure that the trash component and the covers are prioritized 

Custom Collision function can be implemented here