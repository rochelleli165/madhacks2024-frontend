import React from 'react';
import { HeadingSmall, LabelMedium, MonoLabelXSmall, MonoParagraphSmall, ParagraphSmall } from "baseui/typography";
import { Heading, HeadingLevel, HeadingXSmall} from "baseui/heading";

const TwoSum = () => {
  return (
    <HeadingLevel>
    <Heading>Two Sum</Heading>
    <ParagraphSmall>
      Given an array of integers nums and an integer target,
      return indices of the two numbers such that they add up to
      target. You may assume that each input would have exactly
      one solution, and you may not use the same element twice.
      You can return the answer in any order.
    </ParagraphSmall>
    <LabelMedium>Example 1:</LabelMedium>
    <MonoParagraphSmall>
      Input: nums = [2,7,11,15], target = 9 <br />
      Output: [0,1] <br/>
      Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]. 
    </MonoParagraphSmall>
    <LabelMedium>Example 2:</LabelMedium>
    <MonoParagraphSmall>
      Input: nums = [3,2,4], target = 6  <br/>
      Output: [1,2]
      exists.
    </MonoParagraphSmall>
    <LabelMedium>Example 3:</LabelMedium>
    <MonoParagraphSmall>
      Input: nums = [3,3], target = 6 <br/>
      Output: [0,1] 
    </MonoParagraphSmall>
    <LabelMedium>Constraints:</LabelMedium>
    <MonoParagraphSmall>
      2 ≤ nums.length ≤ 10<sup>4</sup> <br/>
      -10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup> <br/>
      -10<sup>9</sup> ≤ target ≤ 10<sup>9</sup> <br/>
      Only one valid answer
      exists.
    </MonoParagraphSmall>
  </HeadingLevel>
  );
}; 

export default TwoSum;