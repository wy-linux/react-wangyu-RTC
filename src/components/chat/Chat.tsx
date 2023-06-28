import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { IMessage } from "../../types/chat";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

export const Chat: React.FC = () => {
    const { chat } = useContext(ChatContext);
    console.log('chat: ', chat)
    return (
        <div
            className="flex flex-col h-full justify-between overflow-hidden"
        >
            <div className="overflow-y-scroll" style={{height: 540}}>
                {chat.messages.map((message: IMessage) => (
                    <ChatBubble
                        message={message}
                        key={
                            message.timestamp + (message?.author || "anonymous")
                        }
                    />
                ))}
            </div>
            <ChatInput />
        </div>
    );
};
