import { selectNames, selectSubjects } from '@/lib/features/ScheduleDataSlice';
import { selectionCountValue } from '@/lib/features/Utilities';
import { useAppSelector } from '@/lib/hooks';
import { Row } from '@/types'
import {
    Menu,
    Item
} from "react-contexify";  
import "react-contexify/dist/ReactContexify.css";

const RowHeaderContextMenu = (
        { rowId, row }: 
        { rowId: Row["id"], row: Row }) => {
    
    const names = useAppSelector(selectNames)
    const subjects = useAppSelector(selectSubjects)
    const subjectsObject = subjects.reduce((acc: any, item) => {
        acc[item.name] = item.color
        return acc
    }, {})    

    const countDigits = selectionCountValue.toString().split('.')[1]?.length || 0

    return (
        <Menu id={"row-header-" + rowId} className="context-menu-container border-none" >
            <Item disabled={true} className='information-section css-reset'>
                <p className='info-name'>{row.name}</p>
                <p className='info-subject'>{names.selections}: {Math.round(row.selectionCount * (10**countDigits))/(10**countDigits)}</p>
                <p className='info-subject' style={{color: subjectsObject[row.subject]}}>{row.subject.charAt(0).toUpperCase() + row.subject.slice(1)}</p>
            </Item>
        </Menu>
    )
}

export default RowHeaderContextMenu