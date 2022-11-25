import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Image,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import logo from "../img/message-logo-removebg-preview.png"
import ChatState from "../Context/ChatProvider"

function Homepage() {
  const history = useHistory();
  // const {selectedFriend} = ChatState();  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    console.log("Home page: ", user);
    if (user) {
      // if(selectedFriend){
      //   history.push("/friend");
      // }
      // else{
        history.push("/chats");
      // }
      
    }
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        mt="4rem"
      >
        {/* <Text fontSize="4xl" fontFamily="Work sans">
          Hoang Chi
        </Text> */}
        <Image src={logo} w="37%"/>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded" colorScheme="green">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
