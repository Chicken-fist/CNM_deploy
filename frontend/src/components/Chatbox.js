import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain, socket, socketConnected }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      // Boostrap, mất nếu thu nhỏ
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat 
      fetchAgain={fetchAgain} 
      setFetchAgain={setFetchAgain} 
      socket={socket}
      socketConnected={socketConnected}
      />
    </Box>
  );
};

export default Chatbox;
