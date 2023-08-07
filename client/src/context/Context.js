import axios from "axios";
import React, { createContext, useEffect, useState, useCallback } from "react";

const Context = createContext();

function Provider({ children }) {
  const [appUser, setAppUser] = useState({});
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [numberOfProductsInCart, setNumberOfProductsInCart] = useState(0);

  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [userTokenIsAdmin, setUserTokenIsAdmin] = useState(
    localStorage.getItem("isa")
  );

  const updateNumberOfCartItems = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/numberofcartproducts",
        {
          userId: appUser.id,
        }
      );
      setNumberOfProductsInCart(res.data.itemCount);
      // console.log(res);
    } catch (err) {
      console.log(err);
      // setNumberOfProductsInCart(0);
    }
  };

  const removeSavedUserToken = async (userToken, id) => {
    try {
      await axios.post("http://localhost:5000/removeusersloggedintokens", {
        userToken,
        id,
        isvendor: userTokenIsAdmin,
      });
      // console.log("remomve user TOken res :", res);
    } catch (err) {}
  };

  async function validateUserToken() {
    try {
      // console.log("isvendor: ", userTokenIsAdmin);
      // console.log("isvendorTYPE: ", typeof userTokenIsAdmin);
      const res = await axios.post(
        "http://localhost:5000/checkusersloggedintokens",
        { userToken, isvendor: userTokenIsAdmin }
      );
      // console.log("async res.data : ", res.data);
      // console.log(" is Valid Tokken : ", res.data);
      setIsValidToken(res.data);
      setIsLoading(false);
    } catch (err) {
      setIsValidToken(false);
      setIsLoading(false);
    }
    // console.log(" is Valid Tokken : ", isValidToken);
  }

  const fetchUserDetails = useCallback(async () => {
    try {
      const userdata = await axios.post("http://localhost:5000/userdetails", {
        userToken,
        isvendor: userTokenIsAdmin,
      });
      // console.log("user Data : ", userdata);
      setAppUser(userdata.data);
      if (!userdata.data.is_admin) {
        try {
          const res = await axios.post(
            "http://localhost:5000/numberofcartproducts",
            {
              userId: userdata.data.id,
            }
          );
          setNumberOfProductsInCart(res.data.itemCount);
          // console.log(res);
        } catch (err) {
          // console.log(err);
          setNumberOfProductsInCart(0);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setAppUser({});
      setIsLoading(false);
    }
  }, [userToken, userTokenIsAdmin]);

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("isa");
    setAppUser({});
    setUserToken("");
    setIsValidToken(false);
    removeSavedUserToken(userToken, appUser.id, appUser.is_admin);
    // window.location.reload();
  };
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

  const fetchCategories = useCallback(async () => {
    if (appUser.id) {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/categories"
        );
        const allVendors = await axios.get("http://localhost:5000/allvendors");
        var categories = [];
        response.data.categories.map((category) => {
          categories.push({
            ...category,
            vendor: allVendors.data.find((vendor) => {
              if (vendor.id === category.vendor_id) return true;
              else return false;
            }),
          });
          return null;
        });
        setCategories(categories);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/categories"
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.log(error);
      }
    }
  }, [appUser.id]);

  useEffect(() => {
    if (isValidToken) {
      fetchUserDetails();
    } else {
      setAppUser({});
    }
    fetchCategories();
  }, [userToken, fetchUserDetails, isValidToken, fetchCategories]);

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
    setUserTokenIsAdmin,
    removeSavedUserToken,
    logout,
    fetchCategories,
    categories,
    numberOfProductsInCart,
    updateNumberOfCartItems,
  };

  return (
    <Context.Provider value={valuesToShare}> {children} </Context.Provider>
  );
}

export { Provider };
export default Context;
