import React, { useRef, useEffect } from 'react'
import 'react-dropdown/style.css';
import Select from 'react-select'

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
    selectFilter, 
    newFilter, 
    selectSubjects,
    selectNames
} from '@/lib/features/ScheduleDataSlice';
import { Subject } from '@/types';

const Filter = (props: {setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const filterRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()

    const filter = useAppSelector(selectFilter)
    const setFilter: any = (val: string) => dispatch(newFilter(val))

    const subjects = useAppSelector(selectSubjects)
    const names = useAppSelector(selectNames)

    useEffect(() => {
        // To close the filter dropdown when the user clicks outside of it
        const handleClickOutside = (event: any) => {
            const filter_btn = document.getElementById("filter-btn")
            if (filterRef.current 
                && !filterRef.current.contains(event.target) 
                && event.target !== filter_btn 
                && !filter_btn?.contains(event.target)
                && event.target.className != "Dropdown-option") {

                props.setIsFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);   

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const subject_object = [...[...subjects.map((subject: Subject) => ({
        value: subject.name,
        label: subject.name.charAt(0).toUpperCase() + subject.name.slice(1)
    }))], {value: "none", label: "None"}]

    return (
        <div className="filter-dropdown" ref={filterRef}>
            <h2>Filter</h2>
            <div className="filter-rows" >
                <h3>{names.rows}</h3>
                <ul>
                    <li>Search: <span className="underline">{filter.rows.searchTerm === "" ? "None" : filter.rows.searchTerm}</span></li>
                    <li>Subjects: 
                        <Select 
                        className='w-52 inline-block ml-2'
                            value={filter.rows.subjects.map((subject) => ({value: subject, label: subject.charAt(0).toUpperCase() + subject.slice(1)}))} 
                            options={subject_object} 
                            isMulti 
                            backspaceRemovesValue 
                            onChange={(newSubjects) => setFilter({...filter, rows: {...filter.rows, subjects: newSubjects.map((newSubject) => newSubject["value"])}})} />
                    </li>

                </ul>
            </div>
            <div className={"filter-selections"}>
                <h3>{names.selections}</h3>
                <ul>
                    <li>Search: <span className="underline">{filter.selections.searchTerm === "" ? "None" : filter.selections.searchTerm}</span></li>
                    <li>Subjects: 
                        <Select 
                        className='w-52 inline-block ml-2'
                            value={filter.selections.subjects.map((subject) => ({value: subject, label: subject.charAt(0).toUpperCase() + subject.slice(1)}))} 
                            options={subject_object} 
                            isMulti 
                            backspaceRemovesValue
                            onChange={(newSubjects) => setFilter({...filter, selections: {...filter.selections, subjects: newSubjects.map((newSubject) => newSubject["value"])}})} />        
                    </li>

                </ul>
            </div>
        </div>
    )
}

export default Filter