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
  const WAIT_TIME = 30; // 30 seconds

  const [code, setCode] = React.useState(``);
  const [activeKey, setActiveKey] = React.useState("0");
  const [activeTest, setActiveTest] = React.useState("0");
  const [DATA, setData] = useState([]);
  const [aliveStatus, setAliveStatus] = useState(true);
  const [q_no, setQ_no] = useState(1);

  const [timer, setTimer] = React.useState(t);
  const [waitTimer, setWaitTimer] = React.useState(WAIT_TIME);

  const codingTimerRef = React.useRef(null);
  const waitTimerRef = React.useRef(null);

  function addItem(newItem) {
    setData((prevData) => [...prevData, newItem]);
  }

  const getTimer = async () => {
    try {
      const response = await fetch(
        `http://ardagurcan.com:5000/session`
      );
      const data = await response.json();
      console.log("Response from backend:", data);
      setTimer(data.timer);
    } catch (error) {
      console.error("Error fetching timer from backend:", error);
    }
  };
  
  // Effect to handle the Coding Timer
  React.useEffect(() => {
    // Reset the timer when q_no changes
    getTimer();

    // Start the coding timer
    codingTimerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(codingTimerRef.current);
          // getAliveStatus();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    // Cleanup on unmount or when q_no changes
    return () => clearInterval(codingTimerRef.current);
  }, [q_no]);

  // Effect to handle actions when Coding Timer reaches zero
  React.useEffect(() => {
    if (timer === 0) {
      if (aliveStatus) {
        // Start the wait timer
        setWaitTimer(WAIT_TIME);
        waitTimerRef.current = setInterval(() => {
          setWaitTimer(prevWait => {
            if (prevWait <= 1) {
              clearInterval(waitTimerRef.current);
              // Proceed to the next question
              setQ_no(prevQ => prevQ + 1);
              getProblem(q_no);
              return 0;
            }
            return prevWait - 1;
          });
        }, 1000);
      }
    }
  }, [timer, aliveStatus, q_no]);

  // Cleanup wait timer on unmount
  React.useEffect(() => {
    return () => clearInterval(waitTimerRef.current);
  }, []);

  const getAliveStatus = async () => {
    try {
      const response = await fetch(
        `http://ardagurcan.com:5000/check_alive`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      console.log("Response from backend:", data);
      // if user in alive users, set alive status to true
      setAliveStatus(data.alive_users.includes(userName));
    } catch (error) {
      console.error("Error fetching problem from backend:", error);
    }
  };

  const [problem, setProblem] = React.useState(null);

  const getProblem = async (q_id) => {
    try {
      const params = new URLSearchParams({ q_id: q_id || 1 });
      const response = await fetch(
        `http://ardagurcan.com:5000/problem?${params}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      console.log("Response from backend:", data);
      setProblem(data);
      if (data.code) setCode(data.code);
    } catch (error) {
      console.error("Error fetching problem from backend:", error);
    }
  };

  React.useEffect(() => {
    getProblem(1);
  }, []);
  // Add refreshTrigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const submitCode = async () => {
    try {
      const params = new URLSearchParams({
        q_id: 1,
        code: encodeURIComponent(code),
        f_name: encodeURIComponent("twoSum"),
        username: encodeURIComponent(userName),
      });

      const response = await fetch(
        `http://ardagurcan.com:5000/check?${params}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      console.log("Response from backend:", data);
      addItem(data);

      // Increment refreshTrigger to signal Leaderboard to refresh
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error sending code to backend:", error);
    }
  };

  return (
    <>
      <Centered>
        <HeadingLevel>
          <HeadingSmall>Time: {timer}</HeadingSmall>
        </HeadingLevel>
      </Centered>
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
                <Editor
                  value={code}
                  onValueChange={(code) => setCode(code)}
                  highlight={(code) => highlight(code, languages.python)}
                  onFocus={(e) => (e.target.style.outline = "none")} // Remove outline on focus
                  padding={10}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    height: "400px",
                  }}
                />
                <Button
                  onClick={submitCode}
                  endEnhancer={() => <Upload size={24} title="" />}
                >
                  Submit
                </Button>
              </Card>
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
    </>
  );
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
  const [timer, setTimer] = React.useState(20);

  // fn to set username and timer
  const handleLogin = async (name) => {
    setUserName(name);
    // Call the backend to get the timer
    try {
      const response = await fetch(
        `http://ardagurcan.com:5000/session?username=${name}`
      );
      const data = await response.json();
      console.log("Response from backend:", data);
      setTimer(data.timer);
    } catch (error) {
      console.error("Error fetching timer from backend:", error);
    }
  };

  return (
    // Move the providers here
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        {userName ? (
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
        padding: ".25rem",
      })}
    >
      {children}
    </div>
  );
};

export default App;
