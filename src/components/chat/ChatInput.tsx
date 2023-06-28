import { useContext, useState, KeyboardEvent} from "react";
import { ChatContext } from "../../context/ChatContext";
import { Button } from "../buttons/Button";
import { useParams } from "react-router-dom";

export const ChatInput: React.FC = () => {
    const [message, setMessage] = useState("");
    const { sendMessage } = useContext(ChatContext);
    const { userId, roomId } = useParams() as Record<string, string>
    const userName = localStorage.getItem(userId)
    console.log('roomId: ', roomId)
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            sendMessage(message, roomId, userId, userName!);
            setMessage("");
        }
    }
    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(message, roomId!, userId!, userName!);
                    setMessage("");
                }}
            >
                <div className="flex ">
                    <textarea
                        className="border rounded"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        type="submit"
                        className="bg-blue-400 p-4 mx-2 rounded-lg text-xl hover:bg-blue-600 text-white"
                        toggle={false}
                    >
                        <svg
                            style={{ transform: "rotate(90deg)" }}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </Button>
                </div>
            </form>
        </div>
    );
}
