import { Box,  } from "@chakra-ui/layout";
import ScrollableFriend from "./ScrollableFriend";
// import callwindow from "./Call/callwindow";

const FriendTable = ({ fetchAgain }) => {


  return (
    <>
      <Box
        // Boostrap, mất nếu thu nhỏ
        d={{ base:  "flex" , md: "flex" }}
        alignItems="center"
        flexDir="column"
        p={3}
        bg="white"
        w={{ base: "100%", md: "74%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <ScrollableFriend></ScrollableFriend>

      </Box>
    </>
  );
};

export default FriendTable;

{
  /* Ko là group chat -> thì hiện tên user*/
}