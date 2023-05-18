import axios from "axios";
import React, { createContext, useEffect, useState, useCallback } from "react";
const Context = createContext();

function Provider({ children }) {
  const [appUser, setAppUser] = useState({});
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));

  const removeSavedUserToken = async (userToken, id) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/removeusersloggedintokens",
        { userToken, id }
      );
      console.log("remomve user TOken res :", res);
    } catch (err) {}
  };

  async function validateUserToken() {
    try {
      const res = await axios.post(
        "http://localhost:5000/checkusersloggedintokens",
        { userToken }
      );
      // console.log("async res.data : ", res.data);
      // console.log(" is Valid Tokken : ", res.data);
      setIsValidToken(res.data);
      setIsLoading(false);
    } catch (err) {
      setIsValidToken(false);
      setIsLoading(false);
    }
  }

  const fetchUserDetails = useCallback(async () => {
    try {
      const userdata = await axios.post("http://localhost:5000/userdetails", {
        userToken,
      });
      console.log("user Data : ", userdata);
      setAppUser(userdata.data);
      setIsLoading(false);
    } catch (error) {
      setAppUser({});
      setIsLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    if (isValidToken) {
      fetchUserDetails();
    }
  }, [userToken, fetchUserDetails, isValidToken]);

  const generateRandomString = (len) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < len) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  const valuesToShare = {
    appUser,
    setAppUser,
    fetchUserDetails,
    generateRandomString,
    isValidToken,
    validateUserToken,
    isLoading,
    setIsValidToken,
    setIsLoading,
    userToken,
    setUserToken,
    removeSavedUserToken,
  };

  return (
    <Context.Provider value={valuesToShare}> {children} </Context.Provider>
  );
}

export { Provider };
export default Context;
