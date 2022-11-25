import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import {
  IconButton,
  Spinner,
  useToast,
  Image,
  Divider,
} from "@chakra-ui/react";
import { getSender, getUserOther, getSenderPic } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import { ArrowBackIcon, InfoOutlineIcon, PhoneIcon } from "@chakra-ui/icons";
import ScrollableChat from "./ScrollableChat";
import animationData from "../animations/typing.json";
import Lottie from "react-lottie";
import { BsPersonPlus, BsPersonCheck } from "react-icons/bs";
import ProfileModal from "./miscellaneous/ProfileModal";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import BoxInformationChat from "./miscellaneous/BoxInformationGroupMember";
import BoxInfoFile from "./miscellaneous/BoxInfoFile";

import { ChatState } from "../Context/ChatProvider";
///////SOCKET///////
import BoxInfoIamge from "./miscellaneous/BoxInforImage";
import InputComponent from "./ChatComponent/InputComponent";

// const ENDPOINT = "http://172.16.10.54:5000"; // socket den
var selectedChatCompare;
//////SOCKET//////

const SingleChat = ({ fetchAgain, setFetchAgain, socket, socketConnected }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // load, xoay vong vong
  // const [socketConnected, setSocketConnected] = useState(false);

  const [pic, setPic] = useState();
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showMakeFriend, setshowMakeFriend] = useState(false);
  const [showAcceptFriend, setshowAcceptFriend] = useState(false);
  const [statusFiend, setStatusFiend] = useState();
  const [contentSendRequest, setcontentSendRequest] = useState("");
  const [disable, setdisable] = useState(false);

  const history = useHistory();

  const {
    selectedChat,
    setSelectedChat,
    user,
    setuser,
    notification,
    setNotification,
    setSocket,
    chats,
    setChats,
  } = ChatState();
  const user1 = JSON.parse(localStorage.getItem("userInfo"));

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);

      setLoading(false);

      socket.emit("join chat", selectedChat._id); // join room chat 1 -1
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  //Kiem tra xem la no da gui loi moi ket ban chua
  const checkStatusFriend = async (selectedChat) => {
    if (!selectedChat) return;
    if (selectedChat.isGroupChat) {
      setshowAcceptFriend(false);
      setshowMakeFriend(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      // const { data } = await axios.post(`/api/chat`, { userId }, config);

      const { data } = await axios.post(
        `/api/friend/getStatusFriend`,
        {
          user: selectedChat.users[0],
          friend: selectedChat.users[1],
        },
        config
      );
      setStatusFiend(data); //////////////////////////////////////////
      if (data.length > 0) {
        if (data[0].status == 1) {
          console.log("da gui loi moi: ", data);
          setshowMakeFriend(false);
          setshowAcceptFriend(true);
          if (data[0].user == user._id) {
            setcontentSendRequest("Request Sended");
            setdisable(true);
          } else {
            setcontentSendRequest("Accept");
            setdisable(false);
          }
        } else {
          console.log("da la banj roi", data);
          setshowAcceptFriend(false);
          setshowMakeFriend(false);
        }
      } else {
        console.log("chua gui gi ca");
        setshowMakeFriend(true);
        setshowAcceptFriend(false);
      }
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // gui loi moi ket ban ne
  const addFriend = async (selectedChat) => {
    if (!selectedChat) return;
    // if (selectedChat.isGroupChat) return;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      // const { data } = await axios.post(`/api/chat`, { userId }, config);

      const { data } = await axios.post(
        `/api/friend/sendRequest`,
        {
          user: user._id,
          friend: getUserOther(user, selectedChat.users)._id,
        },
        config
      );
      if (data.status == 1) {
        checkStatusFriend(selectedChat);
      } else {
        // console.log("da ket ban nhe");
      }
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const makeFriend = async (selectedChat) => {
    if (!selectedChat) return;
    if (selectedChat.isGroupChat) return;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      // const { data } = await axios.post(`/api/chat`, { userId }, config);

      const { data } = await axios.post(
        `/api/friend/makeFriend`,
        {
          user: user._id,
          friend: getUserOther(user, selectedChat.users)._id,
        },
        config
      );
      if (data) {
        console.log("dua da ta day:", data);
        checkStatusFriend(selectedChat);
      }
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  ///////////SOCKET////////////////////
  useEffect(() => {
    if (socket) {
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }
  });
  useEffect(() => {
    if (socket) {
      socket.on("recalled mess", (mess) => {
        if (
          !selectedChatCompare || // if chat is not selected or doesn't match current chat
          selectedChatCompare._id !== mess.chat._id
        ) {
          return;
        } else {
          xuLyRecall(messages, mess);
          setMessages(messages);
        }
      });
    }
  }, [messages]);

  const xuLyRecall = (messages, data) => {
    messages.forEach((messa) => {
      if (messa._id == data._id) {
        messa.recallMessage = 1;
      }
    });
  };

  useEffect(() => {
    if (user == null) {
      setuser(user1);
      history.go(0);
    }
    // tương tự như AJAX: fetchMessages -> thêm message vào
    fetchMessages();
    checkStatusFriend(selectedChat);
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    if (socket) {
      socket.on("message recieved", (newMessageRecieved) => {
        if (
          !selectedChatCompare || // if chat is not selected or doesn't match current chat
          selectedChatCompare._id !== newMessageRecieved.chat._id ||
          selectedChatCompare == undefined
        ) {
          if (!notification.includes(newMessageRecieved)) {
            // set notification
            setNotification([...notification, newMessageRecieved]);
            console.log("thong bap", notification);
            setFetchAgain(!fetchAgain);
          }
        } else {
          setMessages([...messages, newMessageRecieved]);
          selectedChat.latestMessage = newMessageRecieved;
        }
      });
    } else {
      setSelectedChat(chats[chats.length - 1]);
    }
  }, [messages]);

  const handleMakeFriend = () => {
    addFriend(selectedChat);
    setshowMakeFriend(false);
  };

  const handleAcceptFriend = () => {
    if (disable) {
      console.log("ko dc bam ");
    } else {
      console.log("da chap nhan");
      makeFriend(selectedChat);
    }
  };
  const openNewWindow = () => {
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=300,height=300`;
    window.open(
      "http://localhost:3002/?id=" + getUserOther(user, selectedChat.users)._id,
      "tri",
      params
    );
    if (socket) {
      socket.emit("callXXX", selectedChat);
    }
  };

  return (
    <>
      {/* Có User chat chưa??? */}
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            // background="black"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat && (
              <Text fontSize="25px" fontWeight="bold">
                {getSender(user, selectedChat.users)}
              </Text>
            )}
            {selectedChat.isGroupChat && (
              <Text fontSize="25px" fontWeight="bold">
                {/* Group chat -> hiện tên nhóm */}
                {selectedChat.chatName.toString()}
              </Text>
            )}
            <Box w="100px" d="flex" justifyContent={{ base: "space-around" }}>
              <IconButton
                d={{ base: "flex" }}
                icon={<PhoneIcon />}
                onClick={openNewWindow}
              />
              <IconButton
                d={{ base: "flex" }}
                icon={<InfoOutlineIcon />}
                onClick={onOpen}
              />
            </Box>
          </Box>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            className="singleChat"
            width="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            // position="absolute"
          >
            {loading ? (
              // Data load thì sẽ xoay vòng vòng
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <Box className="messages">
                {showMakeFriend && (
                  <Box
                    fontSize={{ base: "100%", md: "100" }}
                    style={{
                      position: "fixed",
                      top: 130,

                      width: "65.5%",
                      alignContent: "center",
                    }}
                  >
                    <Text
                      display="flex"
                      background="#16A085"
                      w="100%"
                      borderRadius={5}
                      fontSize="20px"
                      color="white"
                      justifyContent={"center"}
                      onClick={handleMakeFriend}
                    >
                      <BsPersonPlus />
                      Add Friend
                    </Text>
                  </Box>
                )}

                {showAcceptFriend && (
                  <Box
                    fontSize={{ base: "100%", md: "100" }}
                    style={{
                      position: "fixed",

                      width: "66%",
                      alignContent: "center",
                    }}
                  >
                    <Text
                      borderRadius={5}
                      display="flex"
                      background="#16A085"
                      w="100%"
                      fontSize="20px"
                      color="white"
                      justifyContent={"center"}
                      onClick={handleAcceptFriend}
                    >
                      {!disable && <BsPersonCheck />}
                      {contentSendRequest}
                    </Text>
                  </Box>
                )}
                <ScrollableChat
                  messages={messages}
                  socket={socket}
                ></ScrollableChat>
              </Box>
            )}
            {istyping ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  // height={50}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>
            ) : (
              <></>
            )}
            <InputComponent
              socketConnected={socketConnected}
              socket={socket}
              selectedChat={selectedChat}
              user={user}
            />
          </Box>

          <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="sm">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">Information</DrawerHeader>
              <DrawerBody background="gray.100">
                <Box
                  background="white"
                  w="113%"
                  ml="-25px"
                  borderRadius={5}
                  mb="10px"
                >
                  {messages &&
                    (!selectedChat.isGroupChat ? (
                      <>
                        <Box align="center" justify="center" pt="15px">
                          <ProfileModal user={getUserOther(user, selectedChat.users)} statusFiend={statusFiend}>
                          <Image
                            
                            borderRadius="full"
                            boxSize="50px"
                            src={getSenderPic(user, selectedChat.users)}
                            alt={user.name}
                          />
                          </ProfileModal>
                          <Text fontSize="20px" fontWeight="bold">
                            {getSender(user, selectedChat.users)}
                          </Text>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box align="center" justify="center" pt="15px" >
                          <Image
                            // position="fixed"
                            borderRadius="full"
                            boxSize="50px"
                            src={user.pic}
                            // zIndex={0}
                            alt={user.name}
                          />
                          <Text Text fontSize="20px" fontWeight="bold">
                            {/* Group chat -> hiện tên nhóm */}
                            {selectedChat.chatName.toString()}
                          </Text>
                        </Box>
                      </>
                    ))}
                </Box>
                <Box d="contents" pb={2}>
                  {messages &&
                    (!selectedChat.isGroupChat ? (
                      <>
                        {/* {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                /> */}
                      </>
                    ) : (
                      <>
                        {/* Group chat -> hiện tên nhóm */}
                        {/* {selectedChat.chatName.toString()} */}
                        <BoxInformationChat
                          w="100%"
                          fetchMessages={fetchMessages}
                          fetchAgain={fetchAgain}
                          setFetchAgain={setFetchAgain}
                        />
                      </>
                    ))}
                </Box>
                <Box mt="10px">
                  <BoxInfoIamge />
                </Box>
                <Box mt="10px">
                  <BoxInfoFile />
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on user to start chatting...
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
