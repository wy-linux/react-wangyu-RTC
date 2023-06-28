import { useEffect, useRef } from "react";
import logo from "../assets/logo.png"
export const VideoCard: React.FC<any> = ({stream, userName}) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        if(videoRef.current) videoRef.current.srcObject = stream
    }, [stream])

    return (
        <div>
            {
                stream ?  <video className="w-52" ref={videoRef} controls/>
                    :  <img className="w-52" src={logo} />
            }
            <span className="text-center block bg-slate-50">{userName}</span>
        </div>
    );
};
