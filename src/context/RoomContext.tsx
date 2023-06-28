import {
    createContext,
    useEffect,
    useState,
    useReducer,
} from "react";
import { useParams } from "react-router-dom";
import { message } from "antd"
import Peer from "peerjs";
import { ws } from "../ws";
import { peersReducer, PeerState } from "../reducers/peerReducer";
import {
    addPeerStreamAction,
    removePeerStreamAction,
    addPeerNameAction,
    removePeerAction,
    addAllPeersAction,
} from "../reducers/peerActions";
import { IPeer } from "../types/peer";

interface RoomValue {
    peers: PeerState;
    handleCamera:() => void
}
export const RoomContext = createContext<RoomValue>({
    peers: {},
    handleCamera: () => {}
});

export const RoomProvider: React.FC<{children?: React.ReactNode}> = ({ children }) => {
    const {userId, roomId} = useParams<string>() as Record<string, string>
    const userName = localStorage.getItem(userId)
    const [me, setMe] = useState<Peer>();
    const [peers, dispatch] = useReducer(peersReducer, {});
    const [userStream, setUserStream] = useState<MediaStream>()

    const getUsers = ({
        participants,
    }: {
        participants: Record<string, IPeer>;
    }) => {
        dispatch(addAllPeersAction(participants));
    };
    const removeStream = (peerId: string) => {
        dispatch(removePeerStreamAction(peerId))
    }
    const removePeer = (peerId: string) => {
        dispatch(removePeerAction(peerId));
    };
    const handleCamera =  () => {
        if(!userStream) {
            navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setUserStream(stream);
                dispatch(addPeerStreamAction(userId, stream))
                Object.keys(peers)
                    .filter(peerId => peerId !== userId)
                    .forEach((peerId) => {
                        const call = me!.call(peerId, stream);
                        call.on("stream", (peerStream) => {   
                            dispatch(addPeerStreamAction(peerId, peerStream))
                        });
                    }) 
            })
        } else {
            userStream.getTracks().forEach(track => track.stop())
            setUserStream(undefined)
            dispatch(removePeerStreamAction(userId))
            ws.emit("stop-camera", roomId, userId)
        }           
    }
    const handleJoinError = (error: string) => {
        message.error(error, 1)
               .then(() => window.location.href = "#/home")
    }
    useEffect(() => {
        const peer = new Peer(userId, {
            host: "www.wangyu.cloud",
            port: 9001,
            path: "/",
        });
        console.log('userId: ', userId)
        setMe(peer);

        ws.emit("join-room", { roomId, peerId: userId, userName});
        ws.on("get-users", getUsers);
        ws.on("camera-stopped", removeStream)
        ws.on("user-disconnected", removePeer);
        ws.on("error-joined", handleJoinError)

        return () => {
            ws.off("get-users");
            ws.off("camera-stopped")
            ws.off("user-disconnected");
            ws.off("error-joined")
            me?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!me) return;
        ws.on("user-joined", ({ peerId, userName: name }) => {
            dispatch(addPeerNameAction(peerId, name));
            //用户加入房间时，正在视频分享
            if(userStream) {
                //直接与新加入的用户建立视频连接
                const call = me!.call(peerId, userStream);
                call.on("stream", (peerStream) => {   
                    dispatch(addPeerStreamAction(peerId, peerStream))
                });
            }
        });
        me.on("call", (call) => {
            call.answer(userStream); 
            call.on("stream", (peerStream) => {
                dispatch(addPeerStreamAction(call.peer, peerStream))
            });
        });
        return () => {
            ws.off("user-joined")
            me.off("call")
        };
    }, [me, userStream]);

    return (
        <RoomContext.Provider
            value={{
                peers,
                handleCamera,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
