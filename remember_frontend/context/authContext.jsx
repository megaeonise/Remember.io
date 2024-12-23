import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: "",
  });

  axios.defaults.baseURL = 'http://192.168.68.111:4000/api/v1';
  useEffect(() => {
    const loadLocalStorageData = async () => {
      let data = await AsyncStorage.getItem('@auth');
      let loginData = JSON.parse(data);
      setState({ ...state, user: loginData?.user, token: loginData?.token });
      if (loginData?.token) {
        setTimeout(async () => {
          setState({ user: null, token: '' });
          await AsyncStorage.removeItem('@auth');
          
        }, 10000); // 10 seconds
      }
    };
    loadLocalStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ state, setState }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };