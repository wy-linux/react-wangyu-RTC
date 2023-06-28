import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {ws} from "../ws"
import {v4 as uuidV4} from "uuid"
import {HomeModal, ModalType} from "../components/HomeModal";
import logo from "../assets/logo.png"
import styles from "./Home.module.css"

export const Home = () => {
    const [modalTypeState, setModalTypeState] = useState<ModalType>(ModalType.CREATEROOM)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()
    //创建用户ID(peerId)
    const userId = uuidV4()
    const switchType = (modalType: ModalType) => {
        return () => {
            setIsModalOpen(true)
            setModalTypeState(modalType)
        }
    }
    const toRoom = (roomId: string, userId: string) => {
        navigate(`/room/${roomId}/${userId}`)
    }
    useEffect(() => {
        ws.on("room-created", toRoom)
        return () => {
            ws.off("room-created", toRoom)
        }
    }, [])
    return (
        <div className="App flex flex-col items-center justify-center w-screen min-h-screen">
            <h1 className="text-2xl font-medium mb-3">WangYu-RTC</h1>
            <div className={styles["card"]}>
                <div className={styles["box"]} onClick={switchType(ModalType.CREATEROOM)}>
                    +创建房间
                </div>
                <div className={styles["box"]} onClick={switchType(ModalType.JOINROOM)}>
                    房间号加入
                </div>
                <div className={styles["circle"]}>
                    <img src={logo} alt="WangYu-RTC" />
                </div>
            </div>
            <HomeModal 
                isModalOpen={isModalOpen} 
                modalType={modalTypeState}
                setIsModalOpen={setIsModalOpen}
                toRoom={toRoom}
                userId={userId}
            />
        </div>
    );
};
