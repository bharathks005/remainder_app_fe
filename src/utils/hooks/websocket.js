import { useState, useEffect, useRef, useCallback } from 'react';
import { updateCallerIdsStatus } from '../../store/callerIdsSlice';
import { useDispatch } from 'react-redux';

function useWebSocket(url, options = {}) {
  const { reconnectInterval = 5000, maxReconnectAttempts = 10 } = options;
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const dispatch = useDispatch();

  const connect = useCallback(() => {
    // Create WebSocket instance
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
      reconnectAttempts.current = 0; // Reset reconnection attempts
      console.log('Connected to WebSocket');
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket connection closed');
      reconnect();
    };

    ws.onmessage = (event) => {
        const { data } = event;
        const message = JSON.parse(data);
        if (message.type === 'CREATE_CALLERIDS') {
            dispatch(updateCallerIdsStatus({ status: message.status, data: message.data }));
        }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    wsRef.current = ws;
  }, [url]);

  const reconnect = useCallback(() => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts.current += 1;
        console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`);
        connect();
      }, reconnectInterval);
    } else {
      console.error('Max reconnect attempts reached. Giving up.');
    }
  }, [connect, reconnectInterval, maxReconnectAttempts]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = (message) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(message);
    } else {
      console.error('Cannot send message: WebSocket is not connected');
    }
  };

  return { isConnected, sendMessage };
}

export default useWebSocket;
