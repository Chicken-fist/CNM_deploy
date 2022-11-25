import { AddIcon } from "@chakra-ui/icons";
import { Text, Box } from "@chakra-ui/react";
import {  Stack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/hooks";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  IconButton,
  AccordionIcon,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import ScrollableFeed from "react-scrollable-feed";
import { Divider } from "@chakra-ui/react";
import UserListItem from "../userAvatar/UserListItem";
import ChatLoading from "../ChatLoading";

const MyFriends = () => {
  const { user, setSelectedChat, chats, setChats, setselectedFriend } = ChatState();

  const toast = useToast();
  const [friends, setFriens] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const history = useHistory();

  const handleTimeSend = (timeSend) => {
    const date = new Date(timeSend);

    return date.toLocaleString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchFriend();
  }, []);

  const fetchFriend = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/friend/getListFriend",
        {
          userId: user._id,
        },
        config
      );
      console.log("friends", data);
      setFriens(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      // const { data } = await axios.post(`/api/chat`, { userId }, config);
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      // console.log("ban be: ", data);

      setSelectedChat(data);
      setselectedFriend(false);
      setLoadingChat(false);
      // console.log("ra ta ta ta: ", data);
      history.push("/chats");
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

  return (
    <>
      <Box
        d="flex"
        flexDir="column"
        alignItems="left"
        pt={3}
        bg="white"
        w={{ base: "100%", md: "25%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          fontSize={{ base: "28px", md: "50px" }}
          w="100%"
          bg="white"
          alignItems="center"
        >
          <ScrollableFeed bg="white">
            <Box
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
              d="block"
              w="100%"
              justifyContent="space-between"
              alignItems="initial"
            >
              <Button
                d="flex"
                w="100%"
                leftIcon={<AddIcon />}
                bg="white"
                fontSize="15px"
                justifyContent="initial"
              >
                Add New Friend By Email
              </Button>
              <Button
                d="flex"
                w="100%"
                leftIcon={<AddIcon />}
                bg="white"
                justifyContent="initial"
                fontSize="17px"
              >
                List Friends
              </Button>
              <Button
                d="flex"
                w="100%"
                leftIcon={<AddIcon />}
                bg="white"
                justifyContent="initial"
                fontSize="17px"
              >
                List Groups
              </Button>
            </Box>
            <Divider orientation="horizontal" bg="gray.200" h="2px" />
            <Box
              d="flex"
              flexDir="column"
              p={3}
              bg="white"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      My Friends
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel pb={4}>
                    {friends ? (
                      <Stack overflowY="scroll">
                        {friends.map((friend) => (
                          <Box key={friend._id}>
                            <Text fontSize="20px">
                              <UserListItem
                                key={friend._id}
                                user={friend}
                                handleFunction={() => accessChat(friend._id)}
                              />
                            </Text>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <ChatLoading />
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </ScrollableFeed>
        </Box>
      </Box>
    </>
  );
};

export default MyFriends;
