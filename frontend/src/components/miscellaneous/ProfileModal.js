import { ViewIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import { getUserOther } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";

const ProfileModal = ({ user, children, statusFiend }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat } = ChatState();
  const loggedUser = JSON.parse(localStorage.getItem("userInfo"));
  
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const unfrinedFriend = async () => {
    return;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/friend/unfriend",
        {
          user: loggedUser._id,
          friend: user._id,
        },
        config
        );
        onClose(true);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "FRIEND",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    };
    const checkStatusFriend = () => {
      console.log("TINH TRANG:", statusFiend);
      if(statusFiend !== undefined){
        if(statusFiend[0].status == 2 ){

          return true ;
        }
      }
      return false;
  }

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<InfoOutlineIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            {checkStatusFriend() && (
              <Button onClick={unfrinedFriend} colorScheme="red" mr={5}>
                Unfriend
              </Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
