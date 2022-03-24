import React, { createContext, useState, useMemo, useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

export const ChannelsContext = createContext(null);

/**
 * Pusher configuration
 */
const pusherConfig = {
  key: "d33e3195ea813ac4c885",
  cluster: "us2",
  // auth endpoint for private channels
  // e.g. for Laravel https://example.com/api/broadcasting/auth
  authEndpoint: "http://localhost:8000/broadcasting/auth",
};
export const ChannelProvider = ({ children, authUser, authToken }) => {
  const [channels, setChannels] = useState(null);

  useEffect(() => {
    const channels = getChannels(pusherConfig, authToken);
    setChannels(channels);
    return () => {
      // disconnect from server and reset the channels
      channels.disconnect();
      setChannels(undefined);
    };
  }, [authUser, authToken]);

  return (
    <ChannelsContext.Provider value={channels}>
      {children}
    </ChannelsContext.Provider>
  );
};

/**
 * Hook to use the channels provided via context
 */
export function useChannels() {
  const channels = React.useContext(ChannelsContext);
  return channels;
}

export function useOnline() {
  const channels = useChannels();

  return useMemo(() => {
    return channels && channels.join("online");
  }, [channels]);
}

/**
 * Use private channels
 * It simple return the useChannels with authenticated user bindings
 */
export function usePrivateChannels(authUserId) {
  const channels = useChannels();
  return useMemo(() => {
    return channels && channels.private("updates");
  }, [channels]);
}

/**
 * Get the channels
 */
function getChannels(pusherConfig, authToken) {
  const client = new Pusher(pusherConfig.key, {
    cluster: pusherConfig.cluster,
    forceTLS: true,
    authEndpoint: pusherConfig.authEndpoint,
    auth: authToken
      ? {
          headers: {
            // pass the authorization token when using private channels
            Authorization: `Bearer ${authToken}`,
          },
        }
      : undefined,
  });

  const channels = new Echo({
    broadcaster: "pusher",
    client: client,
  });

  return channels;
}
