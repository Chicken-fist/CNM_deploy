import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender, getSenderPic, getSenderYou } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import { Avatar } from "@chakra-ui/avatar";

const MyChats = ({ fetchAgain, socket }) => {
  const { user, setuser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();
  const loggedUser = JSON.parse(localStorage.getItem("userInfo"));

  const [chat1, setchat1] = useState([]);

  const toast = useToast();

  const history = useHistory();

  // const [plat, setplat] = useState(true);

  const handleTimeSend = (timeSend) => {
    const date = new Date(timeSend);

    return date.toLocaleString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // console.log("log", loggedUser);
  useEffect(() => {
    setuser(loggedUser);
    if (loggedUser == null) {
      history.push("/");
    }
    fetchChats();
  }, [fetchAgain]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);

      setChats(data);
      console.log("tin nhan", data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats (MY CHAT)",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleLastMessage = (lastestMessage) => {
    if (lastestMessage.recallMessage) {
      return "Message Recall";
    }
    return lastestMessage.content;
  };

  const xuLyChats = (chatsX, newMessageRecieved) => {
    chatsX.forEach((chat) => {
      if (chat._id == newMessageRecieved.chat._id) {
        // chat.users.forEach((user1) => {
        // if (user1._id == newMessageRecieved.sender._id) {
        chat.latestMessage = newMessageRecieved;
        setchat1(newMessageRecieved);
        // }
        // });
      }
    });
  };
  useEffect(() => {
    if (socket) {
      socket.on("message recieved", (newMessageRecieved) => {
        // console.log("on: ", socket);
        xuLyChats(chats, newMessageRecieved);
        setChats((prevState) => (prevState = chats));

        // console.log("ham: ", chats);
        // setplat(false);
      });
    }
  }, [selectedChat || chats || chat1]);

  useEffect(() => {
    if (socket) {
      socket.on("recalled mess", (mess) => {
        // console.log("phong chat ben my chat", selectedChat);
        if (
          !selectedChat || // if chat is not selected or doesn't match current chat
          selectedChat._id !== mess.chat._id
        ) {
          console.log("my chat ko dung");
          return;
        } else {
          xuLyChats(chats, mess);
        }
      });
    }
  }, [selectedChat || chats || chat1]);

  const handleBackgroup = (chat) => {
    if (selectedChat) {
      if (selectedChat._id === chat._id) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <Box
        d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          d="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <GroupChatModal>
            <Button
              d="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={handleBackgroup(chat) ? "#ABEBC6" : "white"}
                  color={handleBackgroup(chat) ? "white" : "black"}
                  px={3}
                  py={2}
                  display="flex"
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Avatar
                    mt={3}
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    src={
                      chat.isGroupChat == true
                        ? chat.pic
                        : // "https://cdn-icons-png.flaticon.com/64/1911/1911087.png"
                          getSenderPic(loggedUser, chat.users)
                    }
                  />
                  <Box width="100%">
                    <Box justifyContent="space-between" d="flex">
                      <Text
                        fontSize="lg"
                        fontWeight="400"
                        color="black"
                        d="flex"
                        alignContent="end"
                      >
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                      {chat.latestMessage && (
                        <Text color="gray.500">
                          {handleTimeSend(chat.latestMessage.createdAt)}
                        </Text>
                      )}
                    </Box>

                    {chat.latestMessage && (
                      <>
                        <Text fontSize="md" color="gray.500">
                          {chat.latestMessage.sender.name === loggedUser.name
                            ? "You"
                            : chat.latestMessage.sender.name}
                          :{" "}
                          {chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : handleLastMessage(chat.latestMessage)}
                        </Text>
                      </>
                    )}

                    {/* {chat.latestMessage.recallMessage && (
                      <>
                        <Text fontSize="md" color="gray.500">
                          {chat.latestMessage.sender.name === loggedUser.name
                            ? "You"
                            : chat.latestMessage.sender.name}
                          : Message Recall
                        </Text>
                      </>
                    )} */}
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
