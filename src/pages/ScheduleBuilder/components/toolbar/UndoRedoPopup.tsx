import {
    Menu,
    Item,
} from "react-contexify";
  
import "react-contexify/dist/ReactContexify.css";

const UndoRedoPopup = (props: {closePopup: any}) => {
    return (
        // <div className="absolute top-0 right-0 h-full w-full" onClick={props.closePopup()}>
            <div id="undo-context-menu" className="relative top-3 right-0" >
                <h1 className="absolute top-0 left-0 lg">Hello</h1>
            </div>    
        // </div>
    )
}

export default UndoRedoPopup