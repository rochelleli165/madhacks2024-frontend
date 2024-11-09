import * as React from "react";
import { useState } from 'react';
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css"; //Example style, you can use another

import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, styled } from "baseui";

import { HeadingSmall, LabelMedium, MonoLabelXSmall, MonoParagraphSmall, ParagraphSmall } from "baseui/typography";
import { Heading, HeadingLevel, HeadingXSmall } from "baseui/heading";

import { useStyletron } from "baseui";
import { Grid, Cell } from "baseui/layout-grid";

import { Tabs, Tab } from "baseui/tabs";

import { Button } from "baseui/button";
import { Input } from "baseui/input";
import { Upload } from "baseui/icon";

import SubmissionTable from "./SubmissionTable";
import Join from "./Join";
import Markdown from 'react-markdown';



import {
  Card,
  StyledBody,
  StyledAction
} from "baseui/card";

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

  const [DATA, setData] = useState([]);

  function addItem(newItem) {
    setData((prevData) => [...prevData, newItem]);
  }

  const [problem, setProblem] = React.useState(null);

  const getProblem = async () => {
    try {
      const params = new URLSearchParams({ q_id: 1 });
      const response = await fetch(`http://ardagurcan.com:5000/problem?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
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
    getProblem();
  }, []);

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
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      console.log('Response from backend:', data);
      addItem(data);
    
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
            <Cell span={4}>
              <Inner>
                <Card>
                  <Editor
                    value={code}
                    onValueChange={(code) => setCode(code)}
                    highlight={(code) => highlight(code, languages.python)}
                    padding={10}
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 12,
                      height: "400px",
                    }}
                  />
                  <Button onClick={submitCode} endEnhancer={() => <Upload size={24} title="" />}>
                    Submit
                  </Button>
                </Card>
              </Inner>
            </Cell>
            <Cell span={4}>
              <Inner>
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
                  <Tab title="Test Result">Content 2</Tab>
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

  return (
    // Move the providers here
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        {userName ? <MainApp userName={userName} /> : <Login onLogin={setUserName} />}
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
        //display: 'flex',
        //justifyContent: 'center',
        //alignItems: 'center',
        //background: theme.colors.accent200,
        //color: theme.colors.accent700,
        padding: ".25rem",
      })}
    >
      {children}
    </div>
  );
};

export default App;
