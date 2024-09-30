import React, { useRef, useEffect } from 'react'
import Switch from "react-switch";

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { newColumns, newFilter, newRows, selectColumns, selectFilter, selectRows } from '@/lib/features/ScheduleDataSlice';

const Filter = (props: {setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const filterRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()

    const rows = useAppSelector(selectRows)
    const setRows: any = (val: string) => dispatch(newRows(val))
    
    const columns = useAppSelector(selectColumns)
    const setColumns: any = (val: string) => dispatch(newColumns(val))

    const filter = useAppSelector(selectFilter)
    const setFilter: any = (val: string) => dispatch(newFilter(val))

    useEffect(() => {
        // To close the filter dropdown when the user clicks outside of it
        const handleClickOutside = (event: any) => {
            const filter_btn = document.getElementById("filter-btn")
            if (filterRef.current && !filterRef.current.contains(event.target) && event.target !== filter_btn && !filter_btn?.contains(event.target)) {
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
            <ul className="filter-elements">
            </ul>
        </div>
    )
}

export default Filter