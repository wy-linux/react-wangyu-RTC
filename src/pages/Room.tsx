import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { CanvasButton } from "../components/buttons/CanvasButton";
import { ChatButton } from "../components/buttons/ChatButton";
import { CameraButton } from "../components/buttons/CameraButton";
import {CopyText} from "../components/CopyText"
import { RoomContext } from "../context/RoomContext";
import { Chat } from "../components/chat/Chat";
import { VideoCard } from "../components/VideoCard"
import { ChatContext } from "../context/ChatContext";
import  { Canvas }  from "../components/Canvas"
import { GithubIcon } from "../components/GithubIcon"

export const Room = () => {
    const { roomId, userId } = useParams() as Record<string, string>
    const { peers, handleCamera } = useContext(RoomContext);
    const { toggleChat, chat } = useContext(ChatContext);
    const [isCanvasOpen, setIsCanvasOpen] = useState<boolean>(true)
    const {[userId]: me, ...others} = peers
    console.log('peers: ', peers)

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex grow justify-between">
                <div className="border-r-2">
                    { 
                        <div className="mb-2">
                            <VideoCard {...me}/>
                        </div>
                    }
                    <ul className="list-none overflow-y-auto" style={{height: "calc(100vh - 190px)"}}>
                        {Object.values(others).length === 0 ? (
                            <span className="text-sm mt-60 block text-center font-medium text-blue-400">
                                暂时没有用户加入房间！
                            </span>
                        ) : (
                            Object.values(others)
                                .map((other) => (
                                    <li key={other.peerId}>
                                       <VideoCard {...other}/>
                                    </li>
                                ))
                        )}
                    </ul>
                </div>
                <div className="flex items-center flex-col pt-2">
                    <div className="flex mb-4 items-center">
                        <GithubIcon />
                        <CopyText>
                           {roomId}
                        </CopyText>
                    </div>
                    {isCanvasOpen && <Canvas></Canvas>}
                </div>
                <div className="flex">
                    {chat.isChatOpen && (
                        <div className="border-l-2 pb-16 pl-1">
                            <Chat />
                        </div>
                    )}
                </div>
            </div>
            <div className="h-28 fixed bottom-0 left-1/2 -translate-x-1/2 p-6 flex items-center justify-center">
                <CameraButton onClick={handleCamera} />
                <CanvasButton onClick={() => setIsCanvasOpen(!isCanvasOpen)} />
                <ChatButton onClick={toggleChat} />           
            </div>
        </div>
    );
};
