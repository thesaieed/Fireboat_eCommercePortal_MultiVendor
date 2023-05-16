import React, { createContext, useState, useEffect } from "react";
const Context = createContext();

function Provider({ children }) {
  const localUser = localStorage.getItem("user");
  const [appUser, setAppUser] = useState(localUser);

  useEffect(() => {
    setAppUser(JSON.parse(localStorage.getItem("user")));
  }, [localUser]);

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
