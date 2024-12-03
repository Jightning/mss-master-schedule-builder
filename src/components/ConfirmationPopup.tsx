const ConfirmationPopup = ({setConfirmationResult, close, children}: any) => {
    // If user confirms, close isn't called, it should be called by the parent
    return (
        <div className="shade" onClick={() => close()}>
            <div className="confirmation-popup-container" onClick={(e) => e.stopPropagation()}>
                <div>{children}</div>
                <div className="flex flex-row">
                    <div className="confirmation-btn y-confirmation" onClick={() => {setConfirmationResult(true)}}>Yes</div>
                    <div className="confirmation-btn n-confirmation" onClick={() => {setConfirmationResult(false); close()}}>No</div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationPopup