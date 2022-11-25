import { InfoOutlineIcon } from "@chakra-ui/icons";
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
  Avatar,
} from "@chakra-ui/react";
import { Stack } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
// import ChatLoading from "../ChatLoading";

const UpdateProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userId, setUserId] = useState(user._id);
  const [name, setName] = useState(user.name);
  const [pic, setPic] = useState(user.pic);
  const [birth, setBirth] = useState(user.birth);
  const [sex, setsex] = useState(user.sex.toString());
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [token, settoken] = useState(user.token);
  const history = useHistory();

  const handleTimeSend = () => {
    const x = new Date(birth);
    const month =
      x.getMonth() + 1 < 10 ? "0" + (x.getMonth() + 1) : x.getMonth() + 1;
    const date = x.getDate() < 10 ? "0" + x.getDate() : x.getDate();
    const a = x.getFullYear() + "-" + month + "-" + date;
    return a;
  };

  const deleteImageInInput = () => {
    const e3 = document.getElementById("avartar");

    e3.value = "";
  };

  const postDetails = (pics) => {
    console.log("tam hinh", pics);
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      // setTimeout(() => {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "MongoChat04");
      data.append("cloud_name", "dfgkg5eej");
      fetch("https://api.cloudinary.com/v1_1/dfgkg5eej/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // setPic(data.url.toString());
          // console.log(data.url.toString());
          setPic(data.url.toString());

          setLoading(false);
          deleteImageInInput();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
      // }, 4000);
      console.log("CHAY CHAY NHE!!!");
      // submitHandler();
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      deleteImageInInput();
      setLoading(false);
      return;
    }
  };

  const uploadImagine = () => {
    const e3 = document.getElementById("avartar");
    // const e4 = refImage.current;
    e3.click();
  };

  const updateProfile = async () => {
    setLoading(true);

    var DatePresent = new Date().getFullYear();
    var birhtUser = new Date(birth).getFullYear();
    if (name.length <= 0) {
      toast({
        title: "Please Enter your name ",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    // console.log(DatePresent - birhtUser);
    if (DatePresent - birhtUser < 0) {
      toast({
        title: "Age > 0",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      // console.log("sex", sex);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/user/updateProfile",
        {
          userId,
          name,
          sex,
          birth,
          pic,
        },
        config
      );
      localStorage.removeItem("userInfo");
      data.token = token;
      localStorage.setItem("userInfo", JSON.stringify(data));
      setTimeout(() => {

        history.push("/");
      }, 1000);
      toast({
        title: "Update Success",
        status: "success",
        duration: 7000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

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
      <Modal
        // scrollBehavior={scrollBehavior}
        size="lg"
        onClose={() => {
          onClose();
          setPic(user.pic);
          setName(user.name);
          setBirth(user.birth);
          deleteImageInInput();
        }}
        isOpen={isOpen}
        // isCentered
        // height="1300px"
        // styleConfig={{outerHeight:"5000px"}}
      >
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          ></ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Avatar
              borderRadius="full"
              boxSize="100px"
              src={pic}
              // alt={user.name}
              // id="avartar"
              onClick={uploadImagine}
            />
            <input
              type="file"
              style={{ display: "none" }}
              id="avartar"
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
            />

            <FormControl id="first-name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl id="birthday" isRequired>
              <FormLabel>Birthday</FormLabel>
              <Input
                type="date"
                value={handleTimeSend()}
                // placeholder={handleTimeSend(user.birth)}
                onChange={(e) => {
                  // console.log(e.target.value);
                  setBirth(e.target.value);
                }}
              />
            </FormControl>
            <FormControl id="sex" isRequired>
              <FormLabel>Sex</FormLabel>
              <RadioGroup value={sex} onChange={setsex}>
                <Stack direction="row">
                  <Radio colorScheme="green" value="1">
                    Male
                  </Radio>
                  <Radio colorScheme="green" value="2">
                    Female
                  </Radio>
                  <Radio colorScheme="green" value="3">
                    Other
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              onClick={() => {
                onClose();
                setPic(user.pic);
                setName(user.name);
                setBirth(user.birth);
                deleteImageInInput();
              }}
              mr={3}
            >
              Close
            </Button>
            <Button
              isLoading={loading}
              onClick={updateProfile}
              colorScheme="green"
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateProfileModal;
