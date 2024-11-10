import React from "react";
import Leaderboard from "./Leaderboard";
import { LightTheme, BaseProvider, styled } from "baseui";
import { HeadingLevel } from "baseui/heading";
import { HeadingSmall, HeadingXSmall } from "baseui/typography";
const Centered = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});

const WaitingRoom = (r) => {
const result = r['result']
  if (result == "Lose") {
    return (
      <Centered>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <HeadingLevel>
            <HeadingSmall style={
                {textAlign: "center"}
            }>Game Over</HeadingSmall>
            <HeadingXSmall style={
                {textAlign: "center"}
            }>You Lose. Better Luck Next Time!</HeadingXSmall>
          </HeadingLevel>
        </div>
      </Centered>
    );
  } else if (result == "Win") {
    return (
      <Centered>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <HeadingLevel>
            <HeadingSmall style={
                {textAlign: "center"}
            }>Game Over</HeadingSmall>
            <HeadingXSmall style={
                {textAlign: "center"}
            }>You Win! Congratulations!</HeadingXSmall>
          </HeadingLevel>
        </div>
      </Centered>
    );
  }
};

export default WaitingRoom;
