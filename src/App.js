// App.js
import * as React from "react";
import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css"; //Example style, you can use another

import "./App.css";

import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, styled } from "baseui";

import {
  HeadingSmall,
  ParagraphSmall,
} from "baseui/typography";
import { HeadingLevel } from "baseui/heading";

import { useStyletron } from "baseui";
import { Grid, Cell } from "baseui/layout-grid";

import { Tabs, Tab } from "baseui/tabs";

import { Button } from "baseui/button";
import { Input } from "baseui/input";
import { Upload } from "baseui/icon";

import SubmissionTable from "./SubmissionTable";
import Leaderboard from "./Leaderboard"; // Import the Leaderboard component
import Join from "./Join";
import Markdown from "react-markdown";
import GifOverlay from "./GifOverlay";

import { Card } from "baseui/card";
import WaitingRoom from "./WaitingRoom";

import io from "socket.io-client";
import MysteryBox from "./MysteryItem";

const engine = new Styletron();

const url = "0.0.0.0";
const port = 6789;

const Centered = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
});

function MainApp({ userName, t }) {
  const [wsMessage, setWsMessage] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO client
    const socket = io(`http://${url}:${port}`, {
      transports: ["websocket"], // Optional: Specify transport
    });
    setSocket(socket);

    // Connection established
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    // Listen for 'message' events
    socket.on("message", (message) => {
      console.log("Received message:", message);
      if (message['username'] != userName) {
        switch (message['action']){
          case 'squid':
            setGifSrc('./squid.gif');
            setGifDuration(8300);
            showGif();
            break;
          case 'lightning':
            changeCodeSizeTemporarily();
            break;
          case 'bomb':
            setGifSrc('./blue-shell.gif');
            setGifDuration(8500);
            showGif();
            // sleep for a six seconds
            setTimeout(() => {
            bombCode();
            }, 6000);
            break;
        }
      }
      setWsMessage(message);
      // Handle the message as needed
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Socket.IO connection closed");
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    // Clean up the connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  

  const [timer, setTimer] = React.useState(t);

  useEffect(() => {
    setTimer(t);
  }, [t]);
  const WAIT_TIME = 10; // 30 seconds

  const [code, setCode] = React.useState(``);
  const [activeKey, setActiveKey] = React.useState("0");
  
  const [DATA, setData] = useState([]);
  const [aliveStatus, setAliveStatus] = useState(true);
  const [q_no, setQ_no] = useState(1);

  const [codeSize, setCodeSize] = useState(12);
  const changeCodeSizeTemporarily = () => {
    setCodeSize(5);
    setTimeout(() => {
      setCodeSize(12);
    }, 6000); // 10 seconds
  };
  const bombCode = () => {
    setCode(``);
  };

  const [waitTimer, setWaitTimer] = React.useState(WAIT_TIME);

  const codingTimerRef = React.useRef(null);
  const waitTimerRef = React.useRef(null);

  function addItem(newItem) {
    setData((prevData) => [...prevData, newItem]);
  }

  const getTimer = async () => {
    if (q_no === 1) {
      try {
        const response = await fetch(
          `http://${url}:${port}/session`
        );
        const data = await response.json();
        console.log("Response from backend:", data);
        setTimer(data.timer);
      } catch (error) {
        console.error("Error fetching timer from backend (session):", error);
      }
    } else {
      try {
        const response = await fetch(`http://${url}:${port}/check_alive`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log("Response from backend:", data);  

        setTimer(data.timer);
      } catch (error) {
        console.error("Error fetching timer from backend (check_alive):", error);
      }
    }
  };

  const sendMessageToBackend = (username, action) => {
    if (socket) {
      socket.emit("frontend_message", { message: "Hello from frontend!", username: username, action: action });
    }
  };

  useEffect(() => {
    
    if (codingTimerRef.current) {
      clearInterval(codingTimerRef.current);
    }
  
    getTimer(); // Reset the timer when q_no changes
  
    codingTimerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(codingTimerRef.current);
          codingTimerRef.current = null;
          getAliveStatus(); // Call getAliveStatus when timer reaches 0
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  
    return () => clearInterval(codingTimerRef.current);
  }, [q_no]);
  
  // React.useEffect(() => {
  //   if (timer === 0 && aliveStatus && !waitTimerRef.current) {
  //     console.log("User is alive, starting wait timer...");
  //     setWaitTimer(WAIT_TIME);
  //     waitTimerRef.current = setInterval(() => {
  //       setWaitTimer(prevWait => {
  //         if (prevWait <= 1) {
  //           clearInterval(waitTimerRef.current);
  //           waitTimerRef.current = null;
  //           console.log("Completed question", q_no, "waiting for next question...");
  //           setQ_no(prevQ => prevQ + 1);
  //           return 0;
  //         }
  //         return prevWait - 1;
  //       });
  //     }, 1000);
  //   }
  // }, [timer, aliveStatus]);

  // Cleanup wait timer on unmount
  useEffect(() => {
    return () => clearInterval(waitTimerRef.current);
  }, []);

  const getAliveStatus = async () => {
    try {
      const response = await fetch(`http://${url}:${port}/check_alive`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Response from backend:", data);
  
      const isAlive = data.users.includes(userName);
      setAliveStatus(isAlive);
      setTimer(data.timer);
  
      if (isAlive && !waitTimerRef.current) {
        console.log("User is alive, starting wait timer...");
        setWaitTimer(WAIT_TIME);
        waitTimerRef.current = setInterval(() => {
          setWaitTimer((prevWait) => {
            if (prevWait <= 1) {
              clearInterval(waitTimerRef.current);
              waitTimerRef.current = null;
              console.log("Completed question", q_no, "waiting for next question...");
              setQ_no((prevQ) => prevQ + 1);
              return 0;
            }
            return prevWait - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Error fetching problem from backend:", error);
    }
  };
  

  const [problem, setProblem] = React.useState(null);

  const getProblem = async (q_id) => {
    try {
      const params = new URLSearchParams({ q_id: q_id });
      const response = await fetch(`http://${url}:${port}/problem?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Response from backend:", data);
      setProblem(data);
      if (data.code) setCode(data.code);
    } catch (error) {
      console.error("Error fetching problem from backend:", error);
    }
  };
  

  useEffect(() => {
    getProblem(q_no);
  }, [q_no]);
  
  // Add refreshTrigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const submitCode = async () => {
    if (!problem) {
      console.error("No problem data available");
      return;
    }
    try {
      const params = new URLSearchParams({
        q_id: q_no,
        code: encodeURIComponent(code),
        f_name: encodeURIComponent("twoSum"),
        username: encodeURIComponent(userName),
      });
  
      const response = await fetch(`http://${url}:${port}/check?${params}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Response from backend:", data);
      addItem(data);
  
      // Increment refreshTrigger to signal Leaderboard to refresh
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error sending code to backend:", error);
    }
  };

  const lines = code.split("\n").map((_, index) => index + 1);


  const [showGifOverlay, setShowGifOverlay] = useState(false);
  const [gifSrc, setGifSrc] = useState("");
  const [gifDuration, setGifDuration] = useState(0);

  // Function to show the GIF overlay when needed
  const showGif = () => {
    setShowGifOverlay(true);
  };

  const handleItemUse = (item) => {
    switch (item) {
      case "🦑":
        sendMessageToBackend(userName, 'squid')
        break;
      case "⚡":
        sendMessageToBackend(userName, 'lightning')
        break;
      case "💣":
        sendMessageToBackend(userName, 'bomb')
        break;
    }
  };



  return aliveStatus ? (
    <div
      style={{
        backgroundColor: "#3f3f3f",
        position: 'relative',
        zIndex: 1,
      }}
    >
      {showGifOverlay && (
        <GifOverlay
        gifSrc={gifSrc}  // Path to your GIF
        duration={gifDuration}          // Duration in milliseconds for GIF to show
        onHide={() => setShowGifOverlay(false)}  // Callback to hide overlay after GIF disappears
      />
      )}
       
      <div
        style={{
          backgroundColor: "white",
        }}
      >
        <HeadingLevel>
          <HeadingSmall
            style={{
              textAlign: "center",
              justifyContent: "center",
              alignContent: "center",
              paddingBottom: "8px",
            }}
          >
            Time: {timer}
          </HeadingSmall>
        </HeadingLevel>
      </div>
      
      <Outer>
        <Grid>
          <Cell span={4}>
            <Inner>
              <Card>
                <div>
                  {problem ? (
                    <Markdown>{problem.problem}</Markdown>
                  ) : (
                    <ParagraphSmall>Loading problem...</ParagraphSmall>
                  )}
                </div>
              </Card>
            </Inner>
          </Cell>
          <Cell span={8}>
            <Inner>
              <Card>
                <div style={{ width: '100%', height: "400px", overflow: "auto" }}>
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    {/* Line numbers */}
                    <div
                      style={{
                        padding: "10px",
                        textAlign: "right",
                        color: "#999",
                      }}
                    >
                      {lines.map((lineNumber) => (
                        <div
                          style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                          }}
                          key={lineNumber}
                        >
                          {lineNumber}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}> {/* Container */}
                    <Editor
                      value={code}
                      onValueChange={(code) => setCode(code)}
                      highlight={(code) => highlight(code, languages.python)}
                      onFocus={(e) => (e.target.style.outline = "none")} // Remove outline on focus
                      padding={10}
                      style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: codeSize,
                      }}
                    />
                    <MysteryBox onItemClick={handleItemUse} />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={submitCode}
                  endEnhancer={() => <Upload size={24} title="" />}
                >
                  Submit
                </Button>
                
                
              </Card>
              
              <div style={{ paddingBottom: "12px" }}></div>
              <Card>
                <Tabs
                  onChange={({ activeKey }) => {
                    setActiveKey(activeKey);
                  }}
                  activeKey={activeKey}
                >
                  <Tab title="Submission">
                    <SubmissionTable data={DATA}></SubmissionTable>
                  </Tab>
                  <Tab title="Leaderboard">
                    <Leaderboard refreshTrigger={refreshTrigger} />
                  </Tab>
                </Tabs>
              </Card>
            </Inner>
          </Cell>
        </Grid>
      </Outer>
    </div>
  ) : (WaitingRoom({ result: "Lose" }));
}

function Login({ onLogin }) {
  const [name, setName] = React.useState("");
  const [css] = useStyletron();

  return (
    // Remove the providers from here
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#3f3f3f",
      })}
    >
      <Card
        overrides={{
          Root: {
            style: {
              width: "400px",
              padding: "2rem",
              textAlign: "center",
            },
          },
        }}
      >
        <HeadingSmall>Enter your name to continue</HeadingSmall>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          overrides={{
            Root: { style: { marginTop: "1rem", marginBottom: "1rem" } },
          }}
        />
        <Button onClick={() => onLogin(name)} disabled={!name}>
          Continue
        </Button>
      </Card>
    </div>
  );
}

function App() {
  const [userName, setUserName] = React.useState(null);
  const [timer, setTimer] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);


  // fn to set username and timer
  const handleLogin = async (name) => {
    setIsLoading(true);
    try {
      console.log("Fetching timer for user:", name);
      const response = await fetch(
        `http://${url}:${port}/session?username=${name}`
      );
      const data = await response.json();
      setTimer(data.timer);
      setUserName(name);
    } catch (error) {
      console.error("Error fetching timer from backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        {isLoading ? (
          <div>Loading...</div>
        ) : userName && timer != null ? (
          <MainApp t={timer} userName={userName} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </BaseProvider>
    </StyletronProvider>
  );
}

const Outer = ({ children }) => {
  const [css, theme] = useStyletron();
  return (
    <div
      className={css({
        //background: theme.colors.accent100,
      })}
    >
      {children}
    </div>
  );
};
const Inner = ({ children }) => {
  const [css, theme] = useStyletron();
  return (
    <div
      className={css({
        padding: ".10rem",
      })}
    >
      {children}
    </div>
  );
};

export default App;
