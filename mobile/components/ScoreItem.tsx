import * as React from "react";
import { Surface, DataTable, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { TeamScores } from "../types";
import { styles } from "./ActivityItem";

interface ScoreItemProps {
  item: TeamScores;
  width: number;
}

export default function ScoreItem({ item, width }: ScoreItemProps) {
  const [page, setPage] = React.useState(0);
  const [departmentScores, setDepartmentScores] = React.useState<
    TeamScores["elem_scores"] | TeamScores["hs_scores"]
  >(item.elem_scores);
  const userDepartment = useSelector(
    (state: RootState) => state.user.department
  );

  React.useEffect(() => {
    if (userDepartment == "E" || userDepartment == "K") {
      setDepartmentScores(item.elem_scores);
    } else {
      setDepartmentScores(item.hs_scores);
    }
  }, []);

  return (
    <Surface style={{ ...styles.surface, width: width }}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>
            <Text style={{ fontWeight: "bold" }}>
              {departmentScores == item.elem_scores
                ? "Elementary"
                : "High School"}{" "}
            </Text>
            Team Colors
          </DataTable.Title>
          <DataTable.Title numeric>Scores</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>🔴 Red</DataTable.Cell>

          <DataTable.Cell numeric>{departmentScores.red}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>🟢 Green</DataTable.Cell>
          <DataTable.Cell numeric>{departmentScores.green}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>🔵 Blue</DataTable.Cell>
          <DataTable.Cell numeric>{departmentScores.blue}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>🟡 Yellow</DataTable.Cell>
          <DataTable.Cell numeric>{departmentScores.yellow}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Pagination
          page={page}
          numberOfPages={2}
          onPageChange={(page) => {
            if (departmentScores == item.elem_scores) {
              setDepartmentScores(item.hs_scores);
            } else {
              setDepartmentScores(item.elem_scores);
            }
            setPage(page);
          }}
          label={`Page ${page + 1} out of 2`}
          showFastPaginationControls
        />
      </DataTable>
    </Surface>
  );
}
