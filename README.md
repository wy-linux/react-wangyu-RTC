### React Hook + Typescript + TailwindCss + WebSocket + WebRTC 多人房间实时通信
```shell
1. npm install  下载相关依赖
2. npm run start 启动项目
3. npm run build 打包项目，线上部署
4. 后端接口：https://github.com/wy-linux/react-wangyu-RTC-server
```
##### WebRTC视频流实时通信

```javascript
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
// ......
me.on("call", (call) => {
    call.answer(userStream); 
    call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream))
    });
});
```
##### WebSocket数据实时通信
```javascript
// canvas画板数据
useEffect(() => {
    const context = canvasRef.current!.getContext('2d')!
    ws.on("add-drawData", (data: string) => {
        const arr = JSON.parse(data)
        const {offsetX, offsetY} = arr[0]
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        arr.forEach(({
            offsetX,
            offsetY,
            color,
            brushSize
        }: ICanvas) => {
            context.lineTo(offsetX, offsetY);
            context.strokeStyle = color;
            context.lineWidth = brushSize;
            context.stroke();
        })
        context.closePath();
    })
}, [])

// 聊天数据
const sendMessage = (message: string, roomId: string, author: string, userName: string) => {
    const messageData: IMessage = {
        content: message,
        timestamp: new Date().getTime(),
        author,
        userName
    };
    chatDispatch(addMessageAction(messageData));
    ws.emit("send-message", roomId, messageData);
}
```
##### SVG图标切换Button组件封装
SVG ICON: https://remixicon.com/
```javascript
export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    className,
    type = "submit",
    toggle = true,
    defaultForbidden = false,
    timeWait = 0
}) => { 
    const time = useRef<number>(Date.now())
    const [isForbidden, setIsForbidden] = useState<boolean>(defaultForbidden)
    const isToggleForbidden = toggle && isForbidden 
    const handleClick = () => {
        //对点击事件进行 节流
        if(Date.now() - time.current >= timeWait) {
            onClick && onClick()
            setIsForbidden(!isForbidden)
            time.current = Date.now()
        } else {
            message.info("稍等一会再点击哟！")
        }
    }
    return (
        <button
            type={type}
            onClick={handleClick}
            className={classNames(
                "flex justify-center items-center bg-blue-400 p-2 rounded-lg hover:bg-blue-600 text-white",
                className,
                {
                    "bg-neutral-400":  isToggleForbidden,
                    "hover:bg-neutral-600": isToggleForbidden
                }
            )}
        >
            {isToggleForbidden && (
               //......
            )}
            {children}
        </button>
    );
};

```


