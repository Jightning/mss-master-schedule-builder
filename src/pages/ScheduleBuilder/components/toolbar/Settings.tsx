import './toolbar.css'

import React, { useRef, useEffect } from 'react'
import Switch from "react-switch";

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { newColumns, newRows, newSettings, selectColumns, selectRows, selectSettings } from '@/lib/features/ScheduleDataSlice';

const Settings = (props: {setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const settingsRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()

    const rows = useAppSelector(selectRows)
    const setRows: any = (val: string) => dispatch(newRows(val))
    
    const columns = useAppSelector(selectColumns)
    const setColumns: any = (val: string) => dispatch(newColumns(val))

    const settings = useAppSelector(selectSettings)
    const setSettings: any = (val: string) => dispatch(newSettings(val))

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
        }
    }
    
    return (
        <div className="settings-dropdown" ref={settingsRef}>
            <h2>Settings</h2>
            <ul className="settings-elements">
                <li>
                    <h3>Odd/Even:</h3><Switch className='li-switch' onChange={() => toggle("evenodd")} disabled={checkOddEven()} checked={settings.oddEvenToggle} />
                </li>
                <li>
                    <h3>Odd/Even Autoassign:</h3><Switch className='li-switch' onChange={() => toggle("evenodd-autosplit")} disabled={!settings.oddEvenToggle} checked={settings.oddEvenAutoAssign} />
                </li>
            </ul>
        </div>
    )
}

export default Settings