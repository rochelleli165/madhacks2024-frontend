// Leaderboard.jsx
import React from 'react';
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic';
import { ParagraphSmall } from 'baseui/typography';

const url = "ardagurcan.com"; // Need to also set in api
const port = 6789;

function Leaderboard({ refreshTrigger }) {
  const [data, setData] = React.useState([]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`http://${url}:${port}/leaderboard`);
      const result = await response.json();
      // Sort data by time in ascending order
      result.sort((a, b) => a[1] - b[1]);
      setData(result);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  React.useEffect(() => {
    // Initial fetch
    fetchLeaderboard();

    // Set up interval to fetch every 10 seconds
    const intervalId = setInterval(() => {
      fetchLeaderboard();
    }, 10000); // 10000 ms = 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    // Fetch leaderboard when refreshTrigger changes
    if (refreshTrigger > 0) {
      fetchLeaderboard();
    }
  }, [refreshTrigger]);

  return (
    <TableBuilder data={data}>
      <TableBuilderColumn header="User">
        {(row) => row[0]}
      </TableBuilderColumn>
      <TableBuilderColumn header="Time (s)">
        {(row) => (row[1]*1000).toFixed(2)}
      </TableBuilderColumn>
    </TableBuilder>
  );
}

export default Leaderboard;
