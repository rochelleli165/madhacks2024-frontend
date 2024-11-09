import React from "react";
import {
  HeadingSmall,
  LabelMedium,
  MonoLabelXSmall,
  MonoParagraphSmall,
  ParagraphSmall,
} from "baseui/typography";
import { Heading, HeadingLevel, HeadingXSmall } from "baseui/heading";
import { Input } from "baseui/input";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, styled } from "baseui";
import { StatefulInput } from "baseui/input";
import { Button } from "baseui/button";
import { Card, StyledBody, StyledAction } from "baseui/card";
import "./App.css";
const engine = new Styletron();

const Centered = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
});

const Join = () => {
  const [value, setValue] = React.useState("Hello");
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Centered>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              {" "}
              <HeadingLevel>
                <Heading>LeetCode Civilization </Heading>
              </HeadingLevel>
            </div>
            <div> <Card>
            <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <StatefulInput />
            <Button>Enter</Button>
            </div>
          </Card></div>
          </div>
        
         
        </Centered>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default Join;
