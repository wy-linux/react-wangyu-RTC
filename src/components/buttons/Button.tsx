import {useState, useRef} from "react"
import classNames from "classnames";
import { message } from "antd"
interface ButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    className: string;
    type?: "submit" | "button" | "reset";
    toggle?: boolean;
    defaultForbidden?: boolean;
    timeWait?: number;
}
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
                <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-11 w-11 absolute"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={0}
                >
                    <path d="M7.0943 5.68009L18.3199 16.9057C19.3736 15.5506 20 13.8491 20 12C20 7.58172 16.4183 4 12 4C10.1509 4 8.44939 4.62644 7.0943 5.68009ZM16.9057 18.3199L5.68009 7.0943C4.62644 8.44939 4 10.1509 4 12C4 16.4183 7.58172 20 12 20C13.8491 20 15.5506 19.3736 16.9057 18.3199ZM4.92893 4.92893C6.73748 3.12038 9.23885 2 12 2C17.5228 2 22 6.47715 22 12C22 14.7611 20.8796 17.2625 19.0711 19.0711C17.2625 20.8796 14.7611 22 12 22C6.47715 22 2 17.5228 2 12C2 9.23885 3.12038 6.73748 4.92893 4.92893Z" fill="rgba(255,255,255,1)"></path>
                </svg>
            )}
            {children}
        </button>
    );
};
