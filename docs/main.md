# Table Structure
**3 Main Parts inside _src/components/DnDTeacher.tsx_**

## Teacher Column
### _src/components/TeacherColumn.tsx_
> Single column containing each indivual teacher

**Structure**:\
Solid JS `For` component used to loop through each teacher, displaying the teacher's general information.

**Props:** 
* teachers<sub>1</sub>: `Array<Record<string, any>>`
* _className_: `string`, optional. CSS classes for component


## Period Schedule
### _src/components/PeriodSchedule.tsx_
> **Droppable** period table. Each column is a different _period_, each row is a different _teacher_. Row heights are determined by the `heights` array.

**Structure**:\
Solid JS `For` component used to loop through each period in `periods` array and rendering a `PeriodColumn` component.

**Props:** 
* teachers<sub>1</sub>: `Array<Record<string, any>>`
* periods<sub>3</sub>: `Array<Record<string, any>>`
* heights: `Array<any>`. Row heights determined by teacher height
* _className_: `string`, optional. CSS classes for component

### _src/components/PeriodColumn.tsx_
> Column representing each school class each teacher has in the respective period

**Structure**:\
Solid JS `For` component used to loop through each teacher, displaying the teacher's school class information.\
Each element is a droppable component\
`id` is [TEACHER ID]-[PERIOD ID]\
`data` contains period id `periodID` and teacher index `teacherIndex`
```
const droppable = createDroppable(
    teacher.id + "-" + props.period.id,
    {   periodId: props.period.id,
        teacherIndex: index()   });
```

**Props:** 
* teachers<sub>1</sub>: `Array<Record<string, any>>`
* period: `Record<string, any>`. Period to be represented by column. Refer to footnote 3 for object structure.
* heights: `Array<any>`. Row heights determined by teacher height
* _className_: `string`, optional. CSS classes for component

## Class Column
### _src/components/SchoolClassList.tsx_
> Column containing each **draggable** school class

**Structure**:\
Solid JS `For` component used to loop through each school class, displaying the class's information.

**Props:** 
* schoolClasses<sub>2</sub>: `Array<Record<string, any>>`
* _className_: `string`, optional. CSS classes for component

---
### FootNotes
1. `teachers` is an _array_ containing teacher objects which must be structured in the following manner:\
**Keys**: 
    * **name**: teacher name
    * **id**: _unique_ teacher id
    * **classes**: school class<sub>2</sub> object
2. `schoolClasses` is an _array_ containing school class object which must be structured in the following manner:\
**Keys**:
    * **name**: class name
3. `periods` is an _array_ containing all school period obect which must be structured in the following manner:\
**Keys**:
    * **name**: period display name
    * **id**: unique period id (period-[PERIOD NUMBER])
---