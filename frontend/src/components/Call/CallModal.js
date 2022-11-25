import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useToast,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { IoCallOutline } from "react-icons/io5";

const CallModal = ({ isOpen, onOpen, onClose, otherUser, socket }) => {
  const toast = useToast();

  const openNewWindow = () => {
    // console.log("hello ko ra");
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=300,height=300`;
    window.open(
      "http://localhost:3002/?id=" + otherUser._id,
      "tri",
      params
    );
    if (socket) {
      // socket.emit("callXXX", selectedChat);
    }
  };

  return (
    <>
      {/* <span onChange={onOpen}>{children}</span> */}
      {otherUser && (
        <Modal size="xl" onOpen={onOpen} onClose={onClose} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              d="flex"
              justifyContent="center"
            >
              <Avatar
                mr={2}
                size="md"
                cursor="pointer"
                name={otherUser.name}
                src={otherUser.pic}
              />
              <Text fontSize="15px">{otherUser.name}</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody d="flex" flexDir="column" alignItems="center">
              <IconButton 
              onClick={openNewWindow}
              icon={<IoCallOutline />} />
              <IconButton />
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default CallModal;
