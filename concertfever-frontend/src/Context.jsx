import { createContext, useState } from 'react';

// Define the shape of the context value
const Context = createContext({
  userInfo: {
    userId: null,
    firstName: '',
    lastName: '',
    email: '',
    loggedIn: false,
    cart: 0,
  },
  setUserInfo: () => {} // Placeholder function
});

// Create a provider component
export const ContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    userId: null,
    firstName: '',
    lastName: '',
    email: '',
    loggedIn: false,
    cart: 0,
  });

  // Function to update userInfo with partial updates
  const updateUserInfo = (updates) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      ...updates
    }));
  };

  return (
    <Context.Provider value={{ userInfo, setUserInfo: updateUserInfo }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
