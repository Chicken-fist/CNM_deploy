import React, { createContext, useContext, useEffect, useState } from "react";
// import {useState} from "react-usestateref"
import { useHistory } from "react-router-dom";

export const ChatContext = createContext({});
// contextAPI: qly state of our app -> fetch state directly from 1 place
// truy cập accessAPI mọi nơi
const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  const [user, setuser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [socket, setSocket] = useState();
  const [input, setInput] = useState([]);
  const [selectedFriend, setselectedFriend] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      if(selectedFriend){
        history.push("/friend");
      }
      else{
        history.push("/chats");
      }
      
    } else {
      history.push("/");
    }
  }, [history]);
  return (
    <ChatContext.Provider
      value={{
        user,
        setuser,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        chats,
        setChats,
        selectedFriend,
        setselectedFriend,
        socket,
        setSocket,
        input,
        setInput,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
