import React from "react";
import { useStyletron } from "baseui";
import {
  StatefulDataTable,
  CustomColumn,
  StringColumn,
NumericalColumn,
  COLUMNS,
} from "baseui/data-table";

function transformData(columns, d) {
const data = d['data']
  const rowCount = data.length;
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const error = data[i].error;
    const n = data[i].n;
    const result = data[i].result;
    const runtime = data[i].runtime;
    rows.push({
      id: i,
      data: columns.map((column, j) => {
        switch (column.kind) {
            case COLUMNS.CUSTOM:
                switch (result) {
                    case true:
                        return { color: "green" , status: "Accepted"};
                    case false:
                        return { color: "red" , status: "Error"};
                    default:
                        return { color: "red" , status: "Error"};
                }
        case COLUMNS.STRING:
            if (column.title === "Runtime") {
                return Math.round(runtime * 1000 * 100) / 100;
            }
            return error;
        case COLUMNS.NUMERICAL:
            return n;
          default:
            return "default";
        }
      }),
    });
  }
  return rows;
}

const columns = [
    CustomColumn({
        title: "Status",
        mapDataToValue: (data) => data[0],
        renderCell: function Cell(props) {
            const [css] = useStyletron();
            return (
            <div
                className={css({
                alignItems: "center",
                fontFamily: '"Fira code", "Fira Mono", monospace',
                display: "flex",
                color: props.value.color
                })}
            >
                <div>{props.value.status}</div>
            </div>
            );
        },
    }),
    StringColumn({
        title: "Runtime",
        mapDataToValue: (data) => `${data[1].toString()} ms`,
    }),
    StringColumn({
        title: "Error",
        maxWidth: 300,
        lineClamp: 3,
        mapDataToValue: (data) => `${data[2].toString()}`,
    }),
    NumericalColumn({
        title: "Test cases passed",
        mapDataToValue: (data) => data[3],
    }),
  
];

export default function SubmissionTable(data) {
  const [css] = useStyletron();

  return (
    <div className={css({ height: "300px" })}>
      <StatefulDataTable rowHeight={78} filterable={false} searchable={false} columns={columns} rows={transformData(columns, data)} />
    </div>
  );
}
