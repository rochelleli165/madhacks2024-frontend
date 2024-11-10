// App.js
import * as React from "react";
import { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css"; //Example style, you can use another

import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, styled } from "baseui";

import {
  HeadingSmall,
  LabelMedium,
  MonoLabelXSmall,
  MonoParagraphSmall,
  ParagraphSmall,
} from "baseui/typography";
import { Heading, HeadingLevel, HeadingXSmall } from "baseui/heading";

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

import { Card, StyledBody, StyledAction } from "baseui/card";
import WaitingRoom from "./WaitingRoom";

import io from "socket.io-client";

const engine = new Styletron();

const itemProps = {
  backgroundColor: "mono300",
  height: "scale1000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Centered = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
});

function MainApp({ userName, t }) {
  const [wsMessage, setWsMessage] = useState(null);

  React.useEffect(() => {
    // Initialize Socket.IO client
    const socket = io("http://localhost:6789", {
      transports: ["websocket"], // Optional: Specify transport
    });

    // Connection established
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    // Listen for 'message' events
    socket.on("message", (message) => {
      console.log("Received message:", message);
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

  React.useEffect(() => {
    setTimer(t);
  }, [t]);
  const WAIT_TIME = 10; // 30 seconds

  const [code, setCode] = React.useState(``);
  const [activeKey, setActiveKey] = React.useState("0");
  const [activeTest, setActiveTest] = React.useState("0");
  const [DATA, setData] = useState([]);
  const [aliveStatus, setAliveStatus] = useState(true);
  const [q_no, setQ_no] = useState(1);

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
          `http://ardagurcan.com:6789/session`
        );
        const data = await response.json();
        console.log("Response from backend:", data);
        setTimer(data.timer);
      } catch (error) {
        console.error("Error fetching timer from backend (session):", error);
      }
    } else {
      try {
        const response = await fetch(`http://ardagurcan.com:6789/check_alive`, {
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

  React.useEffect(() => {
    
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
  React.useEffect(() => {
    return () => clearInterval(waitTimerRef.current);
  }, []);

  const getAliveStatus = async () => {
    try {
      const response = await fetch(`http://ardagurcan.com:6789/check_alive`, {
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
      const response = await fetch(`http://ardagurcan.com:6789/problem?${params}`, {
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
  

  React.useEffect(() => {
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
  
      const response = await fetch(`http://ardagurcan.com:6789/check?${params}`, {
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

  return aliveStatus ? (
    <div
      style={{
        backgroundColor: "#3f3f3f",
      }}
    >
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
      {/* Display WebSocket message */}
      {wsMessage && (
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "10px",
            margin: "10px",
            textAlign: "center",
          }}
        >
          <strong>WebSocket Message:</strong> {wsMessage.message} (Value:{" "}
          {wsMessage.value})
        </div>
      )}
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
                    <Editor
                      value={code}
                      onValueChange={(code) => setCode(code)}
                      highlight={(code) => highlight(code, languages.python)}
                      onFocus={(e) => (e.target.style.outline = "none")} // Remove outline on focus
                      padding={10}
                      style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 12,
                      }}
                    />
                  </div>
                </div>
                <Button
                  onClick={submitCode}
                  endEnhancer={() => <Upload size={24} title="" />}
                >
                  Submit
                </Button>
              </Card>
              <div
                style={
                  // change padding bottom to 8px
                  { paddingBottom: "12px" }
                }
              ></div>
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
        `http://ardagurcan.com:6789/session?username=${name}`
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
