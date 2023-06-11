import { useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection, HubConnectionState } from "@microsoft/signalr";

interface UseSignalROptions {
  url: string;
}

type UseSignalRHook = (options: UseSignalROptions) => [HubConnection | null, boolean];

const useSignalR: UseSignalRHook = ({ url }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const hubConnection = new HubConnectionBuilder().withUrl(url).build();
    setConnection(hubConnection);

    const startConnection = async () => {
      try {
        setLoading(true);
        await hubConnection.start();
        setLoading(false);
      } catch (error) {
        console.error("Error starting SignalR connection:", error);
      }
    };

    const stopConnection = async () => {
      try {
        setLoading(true);
        await hubConnection.stop();
        setLoading(false);
      } catch (error) {
        console.error("Error stopping SignalR connection:", error);
      }
    };

    if (hubConnection.state === HubConnectionState.Disconnected) {
      startConnection();
    }

    hubConnection.onclose(() => {
      console.log("SignalR connection closed.  Reconnecting...");
      startConnection();
    });

    return () => {
      stopConnection();
    };
  }, [url]); // Only re-run the effect if the URL changes

  return [connection, loading];
};

export default useSignalR;