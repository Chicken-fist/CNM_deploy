import { Box } from "@chakra-ui/layout";
import { useEffect, useState, useContext } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import CallModal from "../components/Call/CallModal";
import {
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { getUserOther } from "../config/ChatLogics";
// CallModal

const ENDPOINT = "http://localhost:5000"; // socket den
var socket;
const Chatpage = () => {
  // dùng trong ChatBox
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [fetchAgain, setFetchAgain] = useState(false);
  const history = useHistory();
  const [socketConnected, setSocketConnected] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [otherUser, setotherUser] = useState();
  

  useEffect(() => {
    if (user == null) {
      history.go(0);
    }
  }, [history]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true)); // client nhận được rồi mơi save dô client
    
    console.log("SINGLE CHAT:", socket);
  }, []);

  useEffect(() => {
    if(socket){
      socket.on("callYYY", (selectedChat) => {
        console.log("alo call");
        if(user._id != getUserOther(user, selectedChat.users)._id){
          setotherUser(getUserOther(user, selectedChat.users));
          console.log("nguoi kia", otherUser);
          onOpen();
        }
        
      });
    }
    
  });

  

  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        {/* <Button onClick={onOpen} >Hello</Button> */}
        <Box
          d="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {user && <MyChats fetchAgain={fetchAgain} socket={socket} />}
          {user && (
            <Chatbox
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              socket={socket}
              socketConnected={socketConnected}
            />
          )}
        </Box>
      </div>

      <CallModal 
      onOpen={onOpen} 
      onClose={onClose} 
      isOpen={isOpen} 
      otherUser={otherUser}
      socket={socket} />
    </>
  );
};

export default Chatpage;
