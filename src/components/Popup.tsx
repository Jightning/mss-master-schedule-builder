import { ReactNode } from 'react'

type CallbackClosePopupFunction = () => void

const Popup = ({ closePopup, children }: { closePopup: CallbackClosePopupFunction, children?: ReactNode }) => {
	const handleChildClick = (event: any) => {
		// Prevent the popup from closing if the user presses the child element
		event.stopPropagation();
	};

	return (
		<div className="popup-container" onClick={closePopup}>
			<div className="popup-body" onClick={handleChildClick}>
				<svg 
					className='close-popup-btn'
					onClick={closePopup}
					xmlns="http://www.w3.org/2000/svg" height="48px" width="48px" viewBox="0 -960 960 960" fill="#BB271A"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
				</svg>
				
				{children}
			</div>
		</div>
	)
}

export default Popup