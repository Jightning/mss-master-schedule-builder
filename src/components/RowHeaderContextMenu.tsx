import { selectSettings } from '@/lib/features/ScheduleDataSlice';
import { useAppSelector } from '@/lib/hooks';
import { Row } from '@/types'
import {
    Menu,
    Item
} from "react-contexify";  
import "react-contexify/dist/ReactContexify.css";

const RowHeaderContextMenu = (
        { rowId, row, selectionsName }: 
        { rowId: Row["id"], row: Row, selectionsName: string }) => {
        
    const settings = useAppSelector(selectSettings)

    return (
        <Menu id={rowId} className="context-menu-container border-none" >
            <Item disabled={true} className='information-section css-reset'>
                <p className='info-name'>{row.name}</p>
                <p className='info-subject'>{selectionsName}: {row.selectionCount}</p>
                <p className='info-subject' style={{color: settings.colors[row.subject]}}>{row.subject.charAt(0).toUpperCase() + row.subject.slice(1)}</p>
            </Item>
        </Menu>
    )
}

export default RowHeaderContextMenu