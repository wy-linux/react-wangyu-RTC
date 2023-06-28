import { IMessage } from "../../types/chat";
import classNames from "classnames";
import { useParams } from "react-router-dom";

export const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
    const { userId } =useParams()
    const userName = message.userName
    const isSelf = message.author === userId;    
    const time = new Date(message.timestamp).toLocaleTimeString();
    return (
        <div
            className={classNames("m-2 flex", {
                "pl-10 justify-end": isSelf,
                "pr-10 justify-start": !isSelf,
            })}
        >
            <div className="flex flex-col">
                <div
                    className={classNames("inline-block py-2 px-4 rounded", {
                        "bg-blue-200": isSelf,
                        "bg-blue-300": !isSelf,
                    })}
                >
                    {message.content}
                    <div
                        className={classNames("text-xs opacity-50", {
                            "text-right": isSelf,
                            "text-left": !isSelf,
                        })}
                    >
                        {time}
                    </div>
                </div>
                <div
                    className={classNames("text-md", {
                        "text-right": isSelf,
                        "text-left": !isSelf,
                    })}
                >
                    {userName}
                </div>
            </div>
        </div>
    );
};
