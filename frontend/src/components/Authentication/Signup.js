import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack, Stack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Radio, RadioGroup } from "@chakra-ui/react";

const Signup = () => {
  const [show, setShow] = useState(false); // show password, default: false ko cho coi
  const handleClick = () => setShow(!show); // click -> show

  // const [picLoading, setPicLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState();
  const [sex, setsex] = useState('2');

  const submitHandler = async () => {
    setLoading(true);
    var regexName = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    var regexPhone =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
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

    if (!regexName.test(email)) {
      toast({
        title: "Please enter a valid email address",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password.length <= 6) {
      toast({
        title: "Password must be more than 6 characters",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (!regexPhone.test(phone)) {
      toast({
        title: "Phone number is required just number, from 10 to 12 characters",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    // console.log(name, email, password, pic);
    try {
      console.log("sex", sex);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          phone,
          sex,
          birth,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title:
          "Please check your email for further instructions on how to complete your account register.",
        status: "success",
        duration: 7000,
        isClosable: true,
        position: "bottom",
      });
      // localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/");
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
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
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
          setPic(data.url.toString());
          // console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
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

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="birthday" isRequired>
        <FormLabel>Birthday</FormLabel>
        <Input
          type="date"
          onChange={(e) => {
            setBirth(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="sex" isRequired>
        <FormLabel>Sex</FormLabel>
        <RadioGroup value={sex} onChange={setsex}>
          <Stack direction="row">
            <Radio
              colorScheme="green"
              value='1'
            >
              Male
            </Radio>
            <Radio
              colorScheme="green"
              value='2'
             
            >
              Female
            </Radio>
            <Radio
              colorScheme="green"
              value='3'
              
            >
              Other
            </Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="phone" isRequired>
        <FormLabel>Phone Number</FormLabel>
        <Input
          type="tel"
          p={1.5}
          required
          pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
          placeholder="Enter Your Phone Number"
          onChange={(e) => setPhone(e.target.value)}
        />
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="green"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        // color='green'
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
