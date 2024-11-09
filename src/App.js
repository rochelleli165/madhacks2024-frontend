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

import { ParagraphSmall } from "baseui/typography";
import { Heading, HeadingLevel } from "baseui/heading";

import { useStyletron } from "baseui";
import { Grid, Cell } from "baseui/layout-grid";

import { Tabs, Tab } from "baseui/tabs";

import { Button } from "baseui/button";
import { Upload, TriangleRight } from "baseui/icon";

import { StyledLink } from "baseui/link";
import { Layer } from "baseui/layer";
import { ChevronDown, Delete, Overflow } from "baseui/icon";
import { AppNavBar, setItemActive } from "baseui/app-nav-bar";

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
    `function add(a, b) {\n  return a + b;\n}`
  );
  const [activeKey, setActiveKey] = React.useState("0");

  const [mainItems, setMainItems] = React.useState([
    { icon: Upload, label: "Primary A" },
    { icon: Upload, label: "Primary B" },
    {
      icon: ChevronDown,
      label: "Primary C",
      navExitIcon: Delete,
      children: [
        { icon: Upload, label: "Secondary A" },
        { icon: Upload, label: "Secondary B" },
        { icon: Upload, label: "Secondary C" },
        { icon: Upload, label: "Secondary D" },
      ],
    },
    {
      icon: ChevronDown,
      label: "Primary D",
      navExitIcon: Delete,
      children: [
        {
          icon: ChevronDown,
          label: "Secondary E",
          children: [
            { icon: Upload, label: "Tertiary A" },
            { icon: Upload, label: "Tertiary B" },
          ],
        },
        { icon: Upload, label: "Secondary F" },
      ],
    },
  ]);
  const [userItems, setUserItems] = React.useState([
    { icon: Overflow, label: "Account item1" },
    { icon: Overflow, label: "Account item2" },
    { icon: Overflow, label: "Account item3" },
    { icon: Overflow, label: "Account item4" },
  ]);
  function handleMainItemSelect(item) {
    setMainItems((prev) => setItemActive(prev, item));
  }
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>

        <Outer>
          <Grid>
            <Cell span={4}>
              <Inner>
                <HeadingLevel>
                  <Heading>Two Sum</Heading>
                  <ParagraphSmall>
                    Given an array of integers nums and an integer target,
                    return indices of the two numbers such that they add up to
                    target. You may assume that each input would have exactly
                    one solution, and you may not use the same element twice.
                    You can return the answer in any order.
                  </ParagraphSmall>

                  <ParagraphSmall>
                    Example 1: Input: nums = [2,7,11,15], target = 9 Output:
                    [0,1] Explanation: Because nums[0] + nums[1] == 9, we return
                    [0, 1]. Example 2: Input: nums = [3,2,4], target = 6 Output:
                    [1,2] Example 3: Input: nums = [3,3], target = 6 Output:
                    [0,1] Constraints: 2 &lt nums.length &lt 104 -109 &lt
                    nums[i] ≤ 109 -109 &lt target &lt 109 Only one valid answer
                    exists.
                  </ParagraphSmall>
                </HeadingLevel>
              </Inner>
            </Cell>
            <Cell span={4}>
              <Inner>
                <Editor
                  value={code}
                  onValueChange={(code) => setCode(code)}
                  highlight={(code) => highlight(code, languages.python)}
                  padding={10}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    //width: '600px',  // Set the desired width
                    height: "400px", // Set the desired height
                  }}
                />
                <Button endEnhancer={() => <Upload size={24} title="" />}>
                  Submit
                </Button>
                <Button
                  endEnhancer={() => <TriangleRight size={24} title="" />}
                >
                  Run
                </Button>
              </Inner>
            </Cell>
            <Cell span={4}>
              <Inner>
                <Tabs
                  onChange={({ activeKey }) => {
                    setActiveKey(activeKey);
                  }}
                  activeKey={activeKey}
                >
                  <Tab title="Testcase">Content 1</Tab>
                  <Tab title="Test Result">Content 2</Tab>
                </Tabs>
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
