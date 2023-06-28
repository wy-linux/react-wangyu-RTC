import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes, Navigate} from "react-router-dom";
import "./index.css";
import { RoomProvider } from "./context/RoomContext";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { ChatProvider } from "./context/ChatContext";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <>
        <HashRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route
                    path="/room/:roomId/:userId"
                    element={
                        <RoomProvider>
                            <ChatProvider>
                                <Room />
                            </ChatProvider>
                        </RoomProvider>
                    }
                />
                <Route path="*" element={<Navigate to="/home" replace/>} />
            </Routes>
        </HashRouter>
    </>
);