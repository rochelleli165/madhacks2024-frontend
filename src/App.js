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

function MainApp({ userName }) {
  const [code, setCode] = React.useState(``);
  const [activeKey, setActiveKey] = React.useState("0");
  const [activeTest, setActiveTest] = React.useState("0");

  const [DATA, setData] = useState([]);

  function addItem(newItem) {
    setData((prevData) => [...prevData, newItem]);
  }

  const testResultTab = (rowIndex) => {
    console.log("Test Result Tab");
    console.log(String(rowIndex));
    setActiveTest(1);  // Update activeTab as a string
  };

  const [problem, setProblem] = React.useState(null);

  const getProblem = async () => {
    try {
      const params = new URLSearchParams({ q_id: 1 });
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
    getProblem();
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

      const response = await fetch(`http://ardagurcan.com:5000/check?${params}`, {
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

  return (
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
                onFocus={(e) => e.target.style.outline = 'none'} // Remove outline on focus
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
  const [timer, setTimer] = React.useState(0);

  // fn to set username and timer
  const handleLogin = async (name) => {
    setUserName(name);
    // Call the backend to get the timer
    try {
      const response = await fetch(`http://ardagurcan.com:5000/session?username=${name}`);
      const data = await response.json();
      console.log("Response from backend:", data);
      setTimer(data.timer);
      // decrement the timer every second
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } catch (error) {
      console.error("Error fetching timer from backend:", error);
    }
  };

  return (
    // Move the providers here
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        {userName ? <MainApp userName={userName} /> : <Login onLogin={handleLogin} />}
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
