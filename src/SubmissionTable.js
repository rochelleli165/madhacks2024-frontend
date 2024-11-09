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

function makeRowsFromColumns(columns, rowCount) {
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    rows.push({
      id: i,
      data: columns.map((column, j) => {
        switch (column.kind) {
            case COLUMNS.CUSTOM:
                switch (i % 4) {
                    case 0:
                    return { color: "green" , status: "Accepted"};
                    case 1:
                    return { color: "red" , status: "Runtime Error"};
                    case 2:
                    return { color: "red" , status: "Compile Error"};
                    case 3:
                    return { color: "red" , status: "Rejected"};
                    default:
                    return { color: "red" , status: "F"};
                }
          case COLUMNS.STRING:
                return i % 2 ? i - 1 : i + 3;
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

const rows = makeRowsFromColumns(columns, 5);

export default function SubmissionTable() {
  const [css] = useStyletron();
  return (
    <div className={css({ height: "600px" })}>
      <StatefulDataTable columns={columns} rows={rows} />
    </div>
  );
}
