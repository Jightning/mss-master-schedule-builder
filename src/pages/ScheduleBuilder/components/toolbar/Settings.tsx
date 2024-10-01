import './toolbar.css'

import React, { useRef, useEffect, useState } from 'react'
import Switch from "react-switch";

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { newColumns, newRows, newSettings, selectColumns, selectRows, selectSettings } from '@/lib/features/ScheduleDataSlice';
import { getColumnSubjects } from '@/lib/features/ScheduleDataSlice';

const Settings = (props: {setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [isChangeColorsDropdownOpen, setIsChangeColorsDropdownOpen] = useState<boolean>(false)

    const settingsRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()

    const rows = useAppSelector(selectRows)
    const setRows: any = (val: string) => dispatch(newRows(val))
    
    const columns = useAppSelector(selectColumns)
    const setColumns: any = (val: string) => dispatch(newColumns(val))

    const settings = useAppSelector(selectSettings)
    const setSettings: any = (val: string) => dispatch(newSettings(val))

    const subjects = useAppSelector(getColumnSubjects)
    console.log(subjects, "he;;p")
    useEffect(() => {
        // To close the filter dropdown when the user clicks outside of it
        const handleClickOutside = (event: any) => {
            const settings_btn = document.getElementById("settings-btn")
            if (settingsRef.current && !settingsRef.current.contains(event.target) && event.target !== settings_btn && !settings_btn?.contains(event.target)) {
                props.setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);   

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Returns true if there are any columns with an odd/even split
    const checkOddEven = () => {
        for (let i in columns) {
            if (columns[i].oddEven) {
                return true
            }
        }

        return false
    }

    // Toggle different settings using a switch
    const toggle = (type: string) => {
        switch (type) {
            case "evenodd":
                // I know it's wierd, but for some reason setting it prior won't work so bear with me
                setSettings({...{...settings, oddEvenToggle: !settings.oddEvenToggle}, ...(settings.oddEvenToggle ? {oddEvenAutoAssign: false} : {})})
				return
            case "evenodd-autosplit":   
				setSettings({...settings, oddEvenAutoAssign: !settings.oddEvenAutoAssign})
                break
            case "color-column-subjects":
                setSettings({...settings, colorColumnSubjects: !settings.colorColumnSubjects})
                break
            case "color-row-subjects":
                setSettings({...settings, colorRowSubjects: !settings.colorRowSubjects})
                break
        }
    }

    
    return (
        <div className="settings-dropdown" ref={settingsRef}>
            <h2>Settings</h2>
            <ul className="settings-elements">
                <li className='border-solid rounded-lg'>
                    <li>
                        <h4>Odd/Even:</h4><div className="li-switch"><Switch onChange={() => toggle("evenodd")} disabled={checkOddEven()} checked={settings.oddEvenToggle} /></div>
                    </li>
                    <li>
                        <h4>Autoassign:</h4><div className="li-switch"><Switch onChange={() => toggle("evenodd-autosplit")} disabled={!settings.oddEvenToggle} checked={settings.oddEvenAutoAssign} /></div>
                    </li>
                </li>
                <li className='border-solid rounded-lg flex-col'>
                    <h4 className='relative top-1'>Color</h4>
                    <div className='flex flex-row justify-center'>
                        <li>
                            <h4>Columns:</h4><div className='li-switch'><Switch onChange={() => toggle("color-column-subjects")} checked={settings.colorColumnSubjects} /></div>
                        </li>
                        <li>
                            <h4>Rows:</h4><div className='li-switch'><Switch onChange={() => toggle("color-row-subjects")} checked={settings.colorRowSubjects} /></div>
                        </li>
                    </div>
                    
                    <div className={"change-colors-container " + (isChangeColorsDropdownOpen ? "trigger" : "")}>
                        <h4 className={"change-colors-btn"} onClick={() => setIsChangeColorsDropdownOpen((prevValue: boolean) => (!prevValue))}>Change Colors {">>"}</h4>
                        <ul className="change-colors-dropdown">
                            <li>Color 1</li>
                            <li>Color 2</li>
                            <li>Color 3</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Settings