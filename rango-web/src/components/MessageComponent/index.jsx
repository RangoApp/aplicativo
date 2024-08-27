
import './MessageComponent.css';
const MessageComponent = ({ type, text }) => {
    return (
        <div className={`message ${type}`}>
            <p>{text}</p>
        </div>
    );
};

export default MessageComponent;