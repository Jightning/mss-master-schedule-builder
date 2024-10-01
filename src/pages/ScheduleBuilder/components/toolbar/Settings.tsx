import './toolbar.css'

import React, { useRef, useEffect, useState } from 'react'
import Switch from "react-switch";

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { newColumns, newRows, newSettings, selectColumns, selectRows, selectSettings } from '@/lib/features/ScheduleDataSlice';
import { getRowSubjects } from '@/lib/features/ScheduleDataSlice';

import { TwitterPicker } from 'react-color';

const Settings = (props: {setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>, rowsName: string, selectionsName: string}) => {
    const [isChangeColorsDropdownOpen, setIsChangeColorsDropdownOpen] = useState<boolean>(false)
    const [openColorPicker, setOpenColorPicker] = useState("")


    const settingsRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()

    const rows = useAppSelector(selectRows)
    const setRows: any = (val: string) => dispatch(newRows(val))
    
    const columns = useAppSelector(selectColumns)
    const setColumns: any = (val: string) => dispatch(newColumns(val))

    const settings = useAppSelector(selectSettings)
    const setSettings: any = (val: string) => dispatch(newSettings(val))

    const subjects = useAppSelector(getRowSubjects)
    console.log(subjects)

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
                setSettings({...settings, colorSelectionSubjects: !settings.colorSelectionSubjects})
                break
            case "color-row-subjects":
                setSettings({...settings, colorRowSubjects: !settings.colorRowSubjects})
                break
        }
    }

    const handleColorChange = (event: any) => {
        setSettings({...settings, colors: {...settings.colors, [openColorPicker]: event.hex}})
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
                <li className='color-settings-container border-solid rounded-lg flex-col'>
                    <h4>Color</h4>
                    <div className='flex flex-row justify-center'>
                        <li>
                            <h4>{props.rowsName}</h4><div className='li-switch'><Switch onChange={() => toggle("color-row-subjects")} checked={settings.colorRowSubjects} /></div>
                        </li>
                        <li>
                            <h4>{props.selectionsName}</h4><div className='li-switch'><Switch onChange={() => toggle("color-column-subjects")} checked={settings.colorSelectionSubjects} /></div>
                        </li>
                    </div>
                    
                    <div className={"change-colors-container " + (isChangeColorsDropdownOpen ? "trigger" : "")}>
                        <h4 className={"change-colors-btn"} onClick={() => {setIsChangeColorsDropdownOpen((prevValue: boolean) => (!prevValue)); setOpenColorPicker("");}}>Change Colors {">"}</h4>
                        <ul className="change-colors-dropdown"> 
                            {Array.from(subjects).map((subject: string) => (
                                <li className='h-fit flex-col'>
                                    <div className='flex-row flex items-center justify-center'>
                                        <p className='h-fit w-fit'>{subject.charAt(0).toUpperCase() + subject.slice(1)}:</p> 
                                        <div className={'color-picker-btn'} style={{backgroundColor: settings.colors[subject]}} onClick={() => setOpenColorPicker((prevValue) => (prevValue === subject ? "" : subject))}></div>
                                    </div>
                                    {openColorPicker === subject ? <TwitterPicker color={ settings.colors[subject] } onChangeComplete={handleColorChange} width={"280px"} className='justify-center m-auto w-fit'/> : <></>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Settings