import Markdown from 'react-markdown';
import ReactModal from 'react-modal';
import { detectFormat } from '../helpers/misc';
function isSmallScreen(): Boolean {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 768;
    }
    return false;
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        height: '500px',
        overlfow: 'scroll',
        width: isSmallScreen() ? '98vw' : '768px'
    },
};
export default function Modal({
    onClose,
    showDialog,
    explanation
}: {
    onClose: (close: boolean) => void,
    showDialog: boolean
    explanation: string
}) {
    // setShowDialog(false)
    const handleClose = () => {
        onClose(false);
    }

    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={showDialog}
            contentLabel="Minimal Modal Example"
            style={customStyles}
        >
            {
                detectFormat(explanation) === 'HTML' ?
                    <div dangerouslySetInnerHTML={{ __html: explanation }}></div> :
                    <Markdown>{explanation}</Markdown>
            }
            <button onClick={handleClose}>Close Modal</button>
        </ReactModal>
    );
}