import React, { useRef, useEffect } from 'react'
import 'react-dropdown/style.css';
import Select from 'react-select'

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { newFilterLocation, selectFilter, selectFilterLocation, getRowSubjects, newFilter } from '@/lib/features/ScheduleDataSlice';

const Filter = (props: {setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>, rowsName: string, selectionsName: string}) => {
    const filterRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()

    // const rows = useAppSelector(selectRows)
    // const setRows: any = (val: string) => dispatch(newRows(val))
    
    // const columns = useAppSelector(selectColumns)

    const filter = useAppSelector(selectFilter)
    const setFilter: any = (val: string) => dispatch(newFilter(val))

    const filterLocation = useAppSelector(selectFilterLocation) 
    const setFilterLocation: any = (val: string) => dispatch(newFilterLocation(val))

    const subjects = useAppSelector(getRowSubjects)


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

    const subject_object = subjects.map((subject: string) => ({
        value: subject,
        label: subject.charAt(0).toUpperCase() + subject.slice(1)
    }))

    return (
        <div className="filter-dropdown" ref={filterRef}>
            <h2>Filter</h2>
            <div className="filter-rows" >
                <h3 onClick={() => setFilterLocation("rows")} className={filterLocation === "rows" ? "text-blue-500" : ""}>
                    {props.rowsName}
                </h3>
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
                <h3 onClick={() => setFilterLocation("selections")} className={filterLocation === "selections" ? "text-blue-500" : ""}>
                    {props.selectionsName}
                </h3>
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