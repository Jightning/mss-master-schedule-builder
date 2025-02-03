import './toolbar.css'

import React, { useRef, useEffect } from 'react'
import Switch from "react-switch";

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { newSettings, selectColumns, selectNames, selectSettings } from '@/lib/features/ScheduleDataSlice';
import { selectionCountValue } from '@/lib/features/Utilities';

const Settings = (props: {setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const settingsRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    
    const columns = useAppSelector(selectColumns)

    const settings = useAppSelector(selectSettings)
    const setSettings: any = (val: string) => dispatch(newSettings(val))
    const names = useAppSelector(selectNames)

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
                // I know it's weird, but for some reason setting it prior won't work so bear with me
                setSettings({...{...settings, isOddEvenToggle: !settings.isOddEvenToggle}, ...(settings.isOddEvenToggle && {isOddEvenAutoAssign: false})})
				return
            case "evenodd-autosplit":   
				setSettings({...settings, isOddEvenAutoAssign: !settings.isOddEvenAutoAssign})
                break
            case "has-subject-limit":
                setSettings({...settings, hasSelectionLimit: !settings.hasSelectionLimit})
                break
            case "copy-selection":
                setSettings({...settings, isCopySelection: !settings.isCopySelection})
                break
            case "color-column-subjects":
                setSettings({...settings, isColorSelectionSubjects: !settings.isColorSelectionSubjects})
                break
            case "color-row-subjects":
                setSettings({...settings, isColorRowSubjects: !settings.isColorRowSubjects})
                break
        }
    }
    const countDigits = selectionCountValue.toString().split('.')[1]?.length || 0

    // TODO copy selection and the selection limit
    return (
        <div className="settings-dropdown" ref={settingsRef}>
            <h2>Settings</h2>
            <ul className="settings-elements">
                <li className='border-solid rounded-lg'>
                    <li>
                        <h4>Odd/Even:</h4><div className="li-switch"><Switch onChange={() => toggle("evenodd")} disabled={checkOddEven()} checked={settings.isOddEvenToggle} /></div>
                    </li>
                    <li>
                        <h4>Autoassign:</h4><div className="li-switch"><Switch onChange={() => toggle("evenodd-autosplit")} disabled={!settings.isOddEvenToggle} checked={settings.isOddEvenAutoAssign} /></div>
                    </li>
                </li>
                <li className='border-solid rounded-lg flex items-center justify-between'>
                    <li>
                        <div className='subject-limit flex items-center'>
                            <h4>Subject Limit: </h4>
                            <div className="li-switch subject-limit-switch">
                                <Switch onChange={() => toggle("has-subject-limit")} checked={settings.hasSelectionLimit} />
                            </div>
                        </div>
                        <input
                            className="number-input"
                            type="number"
                            step={countDigits > 0 ? '0.' + '0'.repeat(countDigits - 1) + '1' : 10**(Math.abs(Math.round(selectionCountValue)).toString().length-1)}
                            value={settings.hasSelectionLimit ? settings.selectionLimit : 0}
                            onChange={(e) => {
                                if (!settings.hasSelectionLimit) return 
                                const newLimit = parseFloat(e.target.value)
                                setSettings({...settings, selectionLimit: isNaN(newLimit) ? 0 : newLimit})
                            }}
                            min='0'/>
                    </li>
                </li>
                <li className='border-solid rounded-lg'>
                    <li>
                        <h4>Copy Selection: </h4><div className="li-switch"><Switch onChange={() => toggle("copy-selection")} checked={settings.isCopySelection} /></div>
                    </li>
                </li>
                <li className='color-settings-container border-solid rounded-lg flex-col'>
                    <h4>Color</h4>
                    <div className='flex flex-row justify-center'>
                        <li>
                            <h4>{names.rows}</h4><div className='li-switch'><Switch onChange={() => toggle("color-row-subjects")} checked={settings.isColorRowSubjects} /></div>
                        </li>
                        <li>
                            <h4>{names.selections}</h4><div className='li-switch'><Switch onChange={() => toggle("color-column-subjects")} checked={settings.isColorSelectionSubjects} /></div>
                        </li>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Settings