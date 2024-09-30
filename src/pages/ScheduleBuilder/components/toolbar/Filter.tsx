import React, { useRef, useEffect } from 'react'
import Switch from "react-switch";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { newColumns, newFilter, newRows, newFilterLocation, selectColumns, selectFilter, selectRows, selectFilterLocation } from '@/lib/features/ScheduleDataSlice';

const Filter = (props: {setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>, rowsName: string, selectionsName: string}) => {
    const filterRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()

    const rows = useAppSelector(selectRows)
    const setRows: any = (val: string) => dispatch(newRows(val))
    
    const columns = useAppSelector(selectColumns)
    const setColumns: any = (val: string) => dispatch(newColumns(val))

    const filter = useAppSelector(selectFilter)
    const setFilter: any = (val: string) => dispatch(newFilter(val))

    const filterLocation = useAppSelector(selectFilterLocation) 
    const setFilterLocation: any = (val: string) => dispatch(newFilterLocation(val))

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

    const toggle = (type: string) => {
        switch (type) {
            
        }
    }
    
    return (
        <div className="filter-dropdown" ref={filterRef}>
            <h2>Filter</h2>
            <div className={"filter-selections"}>
                <h3 onClick={() => setFilterLocation("selections")}>{props.selectionsName}</h3>
                <ul>
                    <li>Search: {filter.selections.searchTerm === "" ? "None" : filter.selections.searchTerm}</li>
                </ul>
            </div>
            <div className="filter-rows" >
                <h3 onClick={() => setFilterLocation("rows")}>{props.rowsName}</h3>
                <ul>
                    <li>Search: {filter.rows.searchTerm === "" ? "None" : filter.rows.searchTerm}</li>
                </ul>
            </div>
        </div>
    )
}

export default Filter