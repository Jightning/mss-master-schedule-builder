import { selectSettings, selectSubjects } from '@/lib/features/ScheduleDataSlice';
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
        
    const subjects = useAppSelector(selectSubjects)
    const subjectsObject = subjects.reduce((acc: any, item) => {
        acc[item.name] = item.color
        return acc
    }, {})    

    return (
        <Menu id={rowId} className="context-menu-container border-none" >
            <Item disabled={true} className='information-section css-reset'>
                <p className='info-name'>{row.name}</p>
                <p className='info-subject'>{selectionsName}: {row.selectionCount}</p>
                <p className='info-subject' style={{color: subjectsObject[row.subject]}}>{row.subject.charAt(0).toUpperCase() + row.subject.slice(1)}</p>
            </Item>
        </Menu>
    )
}

export default RowHeaderContextMenu