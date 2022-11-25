import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import {
  BsFillEmojiSmileFill,
  
  BsPaperclip,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import axios from "axios";
import { useState } from "react";
import { Box } from "@chakra-ui/layout";
import { IconButton, Grid, GridItem, useToast } from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
import { IoImageOutline } from "react-icons/io5";
import "../styles.css";
import { ChatState } from "../../Context/ChatProvider";
import AWS from "aws-sdk";
import { uploadFile } from "react-s3";

const S3_BUCKET = "07-upload-image";
const REGION = "ap-southeast-1";
const ACCESS_KEY = "AKIA24335YBYTDKA2YT3";
const SECRET_ACCESS_KEY = "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";

const config = {
  bucketName: S3_BUCKET,
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
};

AWS.config.update({
  accessKeyId: "AKIA24335YBYTDKA2YT3",
  secretAccessKey: "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",
});



const InputComponent = ({ socketConnected, socket, selectedChat, user }) => {
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false); // load, xoay vong vong

  // const [pic, setPic] = useState();
  const { input, setInput } = ChatState();
  const handleEmojiClick = (event) => {
    let sym = event.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    let message = newMessage;
    message += emoji;
    setNewMessage(message);
  };
  //Goi input upload hien ra de chon image
  const uploadImagine = () => {
    const e3 = document.getElementById("imagine");
    // const e4 = refImage.current;
    e3.click();
  };
  //Goi input upload hien ra de chon file
  const deleteImageInInput = () => {
    const e3 = document.getElementById("imagine");

    e3.value = "";
  };

  //Goi input upload hien ra de chon file
  const deleteFileInInput = () => {
    const e3 = document.getElementById("file");
    // const e4 = refImage.current;
    e3.value = "";
  };
  //Goi input upload hien ra de chon image
  const uploadFileLen = () => {
    const e3 = document.getElementById("file");
    // const e4 = refImage.current;
    e3.click();
  };
  // Ham gui tin nhan
  const sendMessage = async (event) => {
    // // param: sự kiện
    if (event.key === "Enter" && newMessage) {
      // enter khi có chữ
      socket.emit("stop typing", selectedChat._id);
      setInput(newMessage.trim());
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage(""); // xóa đi thông tin trong input
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage.trim(),
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
      } catch (error) {
        toast({
          // Toast : 1. toast = useToast -> 2. xài
          title: "Error Occured!",
          description: error,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  //Ham xu ly typing co animation
  const typingHandler = async (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 5000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  //Hàm xử lý ảnh
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    // console.log(pics);
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
          console.log(data.url.toString());
          submitHandler(data.url.toString());
          console.log("DO DO DO ");
          setLoading(false);
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
      setLoading(false);
      return;
    }
  };
  const submitHandler = async (pic1) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage(""); // xóa đi thông tin trong input
      console.log("pic nè bạn ơii@@@@@@: ", pic1);
      const { data } = await axios.post(
        "/api/message",
        {
          content: " image",
          chatId: selectedChat,
          pic: pic1,
        },
        config
      );
      // console.log(data);
      socket.emit("new message", data);
      deleteImageInInput();
    } catch (error) {
      toast({
        // Toast : 1. toast = useToast -> 2. xài
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const submitHandlerFile = async (e) => {
    setLoading(true);
    const objectFile = e.target.files;
    const checkedFiles = [];
    setLoading(true);
    if (objectFile.length === 0) {
      toast({
        title: "Please Select an File!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      deleteFileInInput();
      setLoading(false);
      return;
    }
    // console.log(pics);
    else {
      for (let i = 0; i < objectFile.length; i++) {
        if (objectFile[i].size > 1048576) {
          // console.log(objectFile[i].size);
          toast({
            title: "Size of File is too big",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          deleteFileInInput();
          setLoading(false);
          return;
        }

        checkedFiles.push(objectFile[i]);
      }
    }

    checkedFiles.forEach((file1) => {
      uploadFile(file1, config)
        .then(async (filee) => {
          console.log("file: ", filee);
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.post(
              "/api/message/file",
              {
                fileName: filee.key,
                chatId: selectedChat,
                fileURL: filee.location,
              },
              config
            );
            socket.emit("new message", data);
            // deleteImageInInput();
            setLoading(true);
          } catch (error) {
            toast({
              // Toast : 1. toast = useToast -> 2. xài
              title: "Error Occured!",
              description: "Failed to send the Message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          deleteFileInInput();
          setLoading(false);
        });
    });
    setLoading(false);
  };


  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <>
      {/*Input - thanh chat 
    onKeyDown: click Enter sẽ send mesage lun 
    mt: margin-top */}
      <Grid templateColumns="repeat(9, 1fr)" gap={3}>
        <GridItem w="100%" pt={3} colSpan={1} d="flex">
          <Box className="emoji">
            <IconButton
              className="emojiHC"
              variant="outline"
              colorScheme="teal"
              fontSize="20px"
              size="md"
              icon={<BsFillEmojiSmileFill />}
              onClick={handleEmojiPickerhideShow}
            />
            {showEmojiPicker && (
              <EmojiPicker
                className="emojiPickerReactHC"
                emojiStyle="google"
                onEmojiClick={handleEmojiClick}
              />
            )}
          </Box>

          <Box className="send">
            <IconButton
              variant="outline"
              colorScheme="teal"
              size="md"
              fontSize="20px"
              icon={<IoImageOutline />}
              onClick={uploadImagine}
            />

            {/* <img src={Attach} alt=""  /> */}
            <input
              type="file"
              style={{ display: "none" }}
              id="imagine"
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
            />
            {/* </IconButton> */}
          </Box>
          <Box className="micro">
            <IconButton
              size="md"
              variant="outline"
              colorScheme="teal"
              fontSize="20px"
              icon={<BsPaperclip />}
              onClick={uploadFileLen}
            />

            {/* <img src={Attach} alt=""  /> */}
            <input
              type="file"
              style={{ display: "none" }}
              id="file"
              accept="file_extension"
              multiple
              onChange={(e) => submitHandlerFile(e)}
            />
          </Box>
        </GridItem>
        <GridItem
          w="100%"
          colSpan={8}
          className="input-container"
          pt={3}
          d="flex"
        >
          <FormControl
            // className="input-container"
            onKeyDown={sendMessage}
            isRequired

            // marginBottom={15}
            // p={3}
          >
            <Input
              className="col"
              bg="#E0E0E0"
              placeholder="Enter a message.."
              value={newMessage}
              onChange={typingHandler}
              width="98%"
              size="md"
              // onKeyDown={sendMessage}
              // mr={1}
            />
          </FormControl>

          <IconButton
            position="relative"
            variant="outline"
            colorScheme="teal"
            fontSize="20px"
            size="md"
            icon={<BsFillArrowRightCircleFill />}
            onClick={submitHandler}
            isLoading={loading}
            mb={1}
          />
        </GridItem>
      </Grid>
    </>
  );
};

export default InputComponent;
