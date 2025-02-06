const ErrorMessage = ({message}: {message: string}) => {
    return (
        <div className='error-message-container'>
            {message}
        </div>
    )
}

export default ErrorMessage