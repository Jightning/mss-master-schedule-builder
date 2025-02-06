# Master Schedule Builder
> Create any schedule you want by dragging custom selections into custom rows and columns!
## For Editting Schedules
- Start by pressing the **import** button
    - Selecting the "plus" icon will allow you to import, edit, or add the respective values
    - The main import buttons (top right) of import popup import all values at once. \
    (**WARNING**: THIS REPLACES THE CURRENT DATA WITH THE IMPORTED)
    - **Selections** are the draggable elements
    - **Subjects** are like labels given to selections and rows
        - If a value is given a subject, but that subject is not defined it will be filtered under *None*.
- Click off the import popup to start editting the table.
    - Drag selections to the table in order to edit it. 
    - Data is automatically saved to local storage - Might disappear when closing window, remember to export data.
    - **Search** is currently very simple and just matches words to values.
    - **Filter** can be used to only display values of certain Subjects
- **Settings** modify what happens with the data when interacting with it
    - **Odd/Even** | Toggles the odd/even feature (splitting columns into odd and even variants)
        - **Autoassign** | Allows the user to drag a selection over another, already placed selection to automatically assign both to odd and even (odd goes to the selection being dragged)
    - **Selection Limit** | Applies a limit to the number of selections (each selection counts as 0.2, with a selection in odd/even being 0.1)
    - **Copy Selection** | Instead of a selection being erased when moving from one place to another, it gets copied
    - **Color** Applies the respective colors based on the subjects
- Press the **export** button to save the data in a csv/json filtered
    - **JSON** | More data is saved and is more complicated, but saves everything that needs to be saved (Recommended if exporting to work on again at a later date)
    - **CSV** | Stores just the table data
- To mass delete values, there is currently no button, but can be done by pressing ctrl+shift+i, going to application, selection local storage and manually deleting the data there.
---
### WIP
**Code Documentation:** Exalidraw in docs/.excalidraw
### Todo:
- Performance improvement
- Create Tests