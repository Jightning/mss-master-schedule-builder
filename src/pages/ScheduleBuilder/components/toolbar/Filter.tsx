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

    // To close the filter dropdown when the user clicks outside of it
    const handleClickOutside = (event: any) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            props.setIsFilterOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);   

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const checkOddEven = () => {
        for (let i in columns) {
            if (columns[i].oddEven) {
                return false
            }
        }

        return true
    }

    const toggle = (type: string) => {
        switch (type) {
            case "evenodd":
                if (checkOddEven()) {
                    setFilter({...filter, evenOddToggle: !filter.evenOddToggle})
                } else {
                    console.log("Error Toggeling")
                }
        }
    }
    
    return (
        <div className="filter-dropdown" ref={filterRef}>
            <h3>Filter</h3>
            <ul className="filter-elements">
                <li>
                    <h4>Odd/Even</h4><Switch onChange={() => toggle("evenodd")} disabled={!checkOddEven()} checked={filter.evenOddToggle} />
                </li>
            </ul>
        </div>
    )
}

export default Filter