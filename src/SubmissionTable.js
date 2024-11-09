import React from "react";
import { useStyletron } from "baseui";
import {
  StatefulDataTable,
  BooleanColumn,
  CategoricalColumn,
  CustomColumn,
  NumericalColumn,
  StringColumn,
  COLUMNS,
  NUMERICAL_FORMATS,
} from "baseui/data-table";

// https://gist.github.com/6174/6062387
function pseudoRandomString(rowIdx, columnIdx) {
  return (
    (0.88 * rowIdx).toString(36).replace(".", "").substring(2) +
    (0.99 * columnIdx).toString(36).replace(".", "")
  ).slice(0, 10);
}

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
                return Math.round(runtime * 1000 * 100) / 100;
          default:
            return "default" + pseudoRandomString(i, j);
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
  
];

export default function SubmissionTable(data) {
  const [css] = useStyletron();
  return (
    <div className={css({ height: "600px" })}>
      <StatefulDataTable columns={columns} rows={transformData(columns, data)} />
    </div>
  );
}
