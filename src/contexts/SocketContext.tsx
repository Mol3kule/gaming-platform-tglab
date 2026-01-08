'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Socket, io } from 'socket.io-client';

interface iSocketContext {
    socket: Socket | null;
    isSocketConnected: boolean;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    const socket = useMemo(() => {
        return io(process.env.SOCKET_URL!, {
            withCredentials: true,
        });
    }, []);

    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsSocketConnected(true);
        }

        function onDisconnect() {
            setIsSocketConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [socket]);

    return <SocketContext.Provider value={{ socket, isSocketConnected }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error('useSocket must be used within a SocketContextProvider');
    }

    return context;
};
