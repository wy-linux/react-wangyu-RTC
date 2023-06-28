import socketIOClient from "socket.io-client";

export const WS = "https://www.wangyu.cloud:9000";
export const ws = socketIOClient(WS);
