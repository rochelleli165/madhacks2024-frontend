// create chat modal comoponent that has input for answer and then calls an api to get the response and then displays it

import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from "baseui/modal";

import { Button } from "baseui/button";
import { Input, SIZE } from "baseui/input/";
import Markdown from "react-markdown";

const url = "ardagurcan.com";
const port = 6789;

const ChatModal = () => {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [history, setHistory] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message to chat history
    setChatHistory([...chatHistory, { sender: "user", message: inputText }]);
    setInputText("");

    // Make request to your API to get ChatGPT response
    try {

      const params = new URLSearchParams({ question: inputText });
      const response = await fetch(`http://${url}:${port}/ai?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json()
       // console.log(data.result)
      // Add ChatGPT response to chat history
      setHistory(
        `{'role': 'user', content: ${inputText} }, {'role': 'asisstant', content: ${data.result}}`
      );
      setChatHistory([
        ...chatHistory,
        { sender: "user", message: inputText },
        { sender: "chatbot", message: data.result },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <main>
      <div className="chat-window">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
             <Markdown>{msg.message}</Markdown>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="form">
        <Input
          placeholder="Type your message..."
          value={inputText}
          size={SIZE.large}
          clearOnEscape
          onChange={handleInputChange}
        />
        <div style={{paddingBottom:'8px'}}></div>
        <Button>Submit</Button>
      </form>
    </main>
  );
};

export default ChatModal;
