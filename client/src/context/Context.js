import React, { createContext, useState } from "react";
const Context = createContext();

function Provider({ children }) {
  const [appUser, setAppUser] = useState({});

  const valuesToShare = {
    appUser,
    setAppUser,
  };

  return (
    <Context.Provider value={valuesToShare}> {children} </Context.Provider>
  );
}

export { Provider };
export default Context;
