import ScrollableFeed from "react-scrollable-feed";
import BoxMessage from "./miscellaneous/BoxMessage";
import { useRef, useEffect, useState } from "react";

const ScrollableChat = ({ messages, socket }) => {

  const bottomRef = useRef(null);


  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({behavior:"auto"});
    },500);
  }, [messages]);
  return (
    <>
      <ScrollableFeed>
      

        {messages &&
          messages.map((m, i) => (
            <BoxMessage key={i} messages={messages} m={m} i={i} socket={socket} />
          ))}
{/* style={{display: "none",height:"300px", width:"300px"}}  */}
      <div  ref={bottomRef}  />     
      </ScrollableFeed>
     
    </>
  );
};

export default ScrollableChat;
