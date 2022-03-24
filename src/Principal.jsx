import React, { useState } from "react";
import App from "./App";
import Login from "./Login";

function Principal() {
  const [token, setToken] = useState("");
  return (
    <>{token === "" ? <Login setToken={setToken} /> : <App token={token} />}</>
  );
}

export default Principal;
