import React from 'react'
import { Modal, Form, Input} from 'antd';
import {ws} from "../ws"

export enum ModalType {
    CREATEROOM,
    JOINROOM
}
interface ModalProps {
    isModalOpen: boolean;
    modalType: ModalType;
    setIsModalOpen: (isOpen: boolean) => void;
    toRoom: (roomId: string, userId: string) => void;
    userId: string;
}

export const HomeModal: React.FC<ModalProps> = ({
    isModalOpen,
    modalType, 
    setIsModalOpen,
    toRoom,
    userId
}) => {
    const [form] = Form.useForm();
    const isJoinRoom = modalType === ModalType.JOINROOM
    const title = isJoinRoom ? "房间号加入" : "创建房间"
    const okText = isJoinRoom ? "加入" : "创建"
    const handleOk = () => {
        form.validateFields()
            .then(({userName, roomId}) => {
                //对userName持久化存储
                localStorage.setItem(userId, userName)
                setIsModalOpen(false);
                if(modalType === ModalType.CREATEROOM) {
                    //创建房间
                    ws.emit("create-room", userId);
                } else if(modalType === ModalType.JOINROOM) {
                    toRoom(roomId, userId)
                }
                form.resetFields();
            })
            .catch((info) => {
              console.log('校验失败:', info);
            })
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    
    return (
        <div className="">
            <Modal 
                title={title} 
                okText={okText}
                cancelText="返回"
                destroyOnClose
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="room-modal"
                >
                    <Form.Item
                        name="userName"
                        label="您的姓名："
                        rules={[{ required: true, message: '请输入姓名！' }]}
                    >
                      <Input />
                    </Form.Item>
                    {
                        isJoinRoom && (
                            <Form.Item 
                                name="roomId" 
                                label="房间号："
                                rules={[{ required: true, message: '请输入房间号！' }]}
                            >
                                <Input />
                            </Form.Item>
                        )
                    }

                </Form>
            </Modal>
        </div>
    )
}