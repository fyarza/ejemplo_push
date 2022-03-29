import React, { useCallback, useEffect, useState } from "react";
import { ChannelProvider, usePrivateChannels } from "./Context";
import Online from "./Online";
import axios from "axios";

function App({ token }) {
  const [user, setUser] = useState(false);
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const result = await axios.request({
          baseURL: "https://dev-mariner-340013.uc.r.appspot.com",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          method: "get",
          url: "/user/logged",
          params: {},
        });
        if (result.data.code === 200) {
          setUser(result.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();
    return () => {
      setUser(false);
    };
  }, [token]);

  return (
    <ChannelProvider authToken={token} authUser={user}>
      <Notifications authUser={user.id} token={token} />
      <Online />
    </ChannelProvider>
  );
}

function useNotificationChannel(authUserId, onChange) {
  const channels = usePrivateChannels(authUserId);
  useEffect(() => {
    if (channels) {
      channels.listen("UpdateCreatedEvent", onChange);
      return () => {
        channels.stopListening("UpdateCreatedEvent");
      };
    }
  }, [channels, onChange]);
}

const Notifications = ({ authUserId, token }) => {
  const [notifications, setNotifications] = useState([]);
  const handleNotificationsEvent = useCallback(
    (notification) => {
      setNotifications([...notifications, notification.update]);
    },
    [notifications]
  );

  // useEffect(() => {
  //   const getNotifications = async () => {
  //     try {
  //       const result = await axios.request({
  //         baseURL: "http://localhost:8000",
  //         headers: {
  //           Accept: "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         method: "get",
  //         url: "/updates",
  //         params: {},
  //       });
  //       console.log("resultado de notifications", result);
  //       if (result.status === 200) {
  //         setNotifications(result.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getNotifications();
  // }, [token]);

  useNotificationChannel(authUserId, handleNotificationsEvent);

  return (
    <ol>
      {notifications.map((item) => (
        <li key={item?.id}>
          <p>{item?.text}</p>
          <p>{item?.user?.name}</p>
        </li>
      ))}
    </ol>
  );
};

export default App;
