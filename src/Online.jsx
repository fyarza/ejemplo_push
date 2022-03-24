import React, { useEffect, useReducer } from "react";
import { useOnline } from "./Context";

function reducer(state, action) {
  switch (action.type) {
    case "setUsers":
      return { users: action.payload };
    case "addUser":
      console.log("action", action.payload);
      const updateUsers = {
        users: [...state.users, action.payload],
      };
      return updateUsers;
    case "removeUser":
      return { users: state.users.filter((u) => u.id !== action.payload.id) };
    default:
      return state;
  }
}
function useOnlineChannel() {
  const channels = useOnline();
  const [state, dispatch] = useReducer(reducer, { users: [] });

  useEffect(() => {
    if (channels) {
      channels
        .here((users) => dispatch({ type: "setUsers", payload: users })) //devuelve todos usuarios conectados
        .joining((user) => dispatch({ type: "addUser", payload: user })) //devuelve el usuario que se conecto
        .leaving((user) => dispatch({ type: "removeUser", payload: user })); // elimina el usuario que se desconecto
    }
  }, [channels]);
  return { users: state.users };
}

export default function Online() {
  const { users } = useOnlineChannel();
  console.log("usuarios conectados", users);
  return (
    <div style={{ marginTop: 10 }}>
      <h1>USUARIOS CONECTADOS</h1>
      <ul>
        {users.map((item) => (
          <li key={item.id} style={{ marginBottom: 10 }}>
            <p>ID:{item.id}</p>
            <p>Name:{item.name}</p>
            <p>Email:{item.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
