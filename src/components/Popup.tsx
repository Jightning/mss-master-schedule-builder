import React, { ReactNode } from 'react'

type CallbackClosePopupFunction = () => void

const Popup = ({ closePopup, children }: { closePopup: CallbackClosePopupFunction, children?: ReactNode }) => {
  return (
    <div className="popup-container">
        <div className="popup-body">
          <svg 
            className='close-popup-btn'
            onClick={closePopup}
            xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960" fill="#BB271A"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          {children}
        </div>
    </div>
  )
}

export default Popup