import * as React from "react";
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
import { Heading, HeadingLevel, HeadingXSmall} from "baseui/heading";

import { useStyletron } from "baseui";
import { Grid, Cell } from "baseui/layout-grid";

import { Tabs, Tab } from "baseui/tabs";

import { Button } from "baseui/button";
import { Upload } from "baseui/icon";

import TwoSum from "./TwoSum";
import SubmissionTable from "./SubmissionTable";

import {
  Card,
  StyledBody,
  StyledAction
} from "baseui/card";

import {
  StatefulDataTable,
  CategoricalColumn,
  CustomColumn,
  NumericalColumn,
  StringColumn,
  COLUMNS,
  NUMERICAL_FORMATS,
} from "baseui/data-table";


const engine = new Styletron();

const itemProps = {
  backgroundColor: "mono300",
  height: "scale1000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function App() {
  const [code, setCode] = React.useState(
    `def twoSum(self, nums: List[int], target: int) -> List[int]:`
  );
  const [activeKey, setActiveKey] = React.useState("0");

  const DATA = [
    ["Accepted", 11],
    ["Accepted", 5],
    ["Compile Error", 30],
  ];
  
  const COLUMNS = ["Status", "Runtime"];

  const submitCode = async () => {
    try {
      const params = new URLSearchParams({
        q_id: 1,
        code: encodeURIComponent(code),
        f_name: encodeURIComponent("twoSum"),
      })

      const response = await fetch(`http://ardagurcan.com:5000/check?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json()
      console.log('Response from backend:', data);
    } catch (error) {
      console.error('Error sending code to backend:', error);
    }
  };

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>

        <Outer>
          <Grid>
            <Cell span={4}>
              <Inner>
                <Card>
                <TwoSum />
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
                  onFocus={(e) => e.target.style.outline = 'none'} // Remove outline on focus
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    //width: '600px',  // Set the desired width
                    height: "400px", // Set the desired height
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
                    <SubmissionTable></SubmissionTable>
                  </Tab>
                  <Tab title="Test Result">Content 2</Tab>
                </Tabs>
                </Card>
              </Inner>
            </Cell>
          </Grid>
        </Outer>
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
