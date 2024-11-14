import { addState, selectSettings } from '@/lib/features/ScheduleDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Column, Selection, ScheduleBuilderAction } from '@/types'
import {
    Menu,
    Item
} from "react-contexify";  
import "react-contexify/dist/ReactContexify.css";

const ContextMenu = (
        { selectionId, selection, rowIndex, columnId }: 
        { selectionId: Selection["id"], selection: Selection, rowIndex?: number, columnId?: Column["id"] }) => {
        
    const dispatch = useAppDispatch()
    const addHistoryState: any = (val: ScheduleBuilderAction) => dispatch(addState(val))
    const settings = useAppSelector(selectSettings)

    return (
        <Menu id={selectionId} className="absolute context-menu-container border-none" >
             {rowIndex !== undefined && columnId && <Item 
                                className='context-menu-delete' 
                                onClick={() => addHistoryState({type: "DELETE_SIMPLE_ROW", action: {columnId: columnId, toChange: rowIndex, selection: selection}})}>
                                <p>Delete</p>
                        </Item>}

            <div className='information-section'>
                <p className='info-name'>{selection.name}</p>
                <p className='info-subject' style={{color: settings.colors[selection.subject]}}>{selection.subject.charAt(0).toUpperCase() + selection.subject.slice(1)}</p>
            </div>
        </Menu>
    )
}

export default ContextMenu