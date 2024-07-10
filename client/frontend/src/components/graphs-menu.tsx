import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { actionMenuAtom, dataInputAtoms } from "@/features/atoms";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0"];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export const GraphsMenuWrapper = () => {
  const actionMenu = useAtomValue(actionMenuAtom);
  if (actionMenu !== "graphs") return null;
  return <GraphsMenu />;
};

const GraphsMenu: React.FC = () => {
  const [actionMenu, setActionMenu] = useAtom(actionMenuAtom);
  const [readableData, setReadableData] = useState<any[]>([]);
  const [transformedData, setTransformedData] = useState<any[]>([]);
  const [graphType, setGraphType] = useState("line");
  const dataInput = useAtomValue(dataInputAtoms.data);

  const makeReadable = () => {
    let pbRequestData = dataInput.map((item) => {
      return {
        row: item.row,
        values: item.values.map((ref: any) => Number(ref.value)),
      };
    });
    setReadableData(pbRequestData);
    setTransformedData(transformData(pbRequestData));
  };

  const transformData = (
    data: {
      row: string;
      values: number[];
    }[]
  ) => {
    const maxLength = Math.max(...data.map((item) => item.values.length));
    const result: {
      [key: string]: number;
    }[] = Array(maxLength).fill({});

    data.forEach((item) => {
      item.values.forEach((value, index) => {
        result[index] = { ...result[index], [item.row]: value };
      });
    });

    return result;
  };

  if (!dataInput || dataInput.length === 0) {
    return;
  }
  return (
    <Drawer
      open={actionMenu === "graphs"}
      onClose={() => setActionMenu("")}
      onOpenChange={makeReadable}
    >
      <DrawerContent className="h-full p-4">
        <DrawerHeader className="border-b border-primary pb-4">
          <DrawerTitle>
            <h1 className="text-2xl font-semibold">IXIOS - Graphs</h1>
          </DrawerTitle>
          <DrawerDescription>
            Visualize your data with a variety of chart types.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 mt-6 space-y-4 overflow-y-auto h-[83.5vh] w-full border rounded-lg">
          <div className="flex space-x-4 justify-center align-items-center">
            <Button
              variant={graphType === "line" ? "ghost" : "outline"}
              onClick={() => setGraphType("line")}
            >
              Line Chart
            </Button>
            <Button
              variant={graphType === "bar" ? "ghost" : "outline"}
              onClick={() => setGraphType("bar")}
            >
              Bar Chart
            </Button>
            <Button
              variant={graphType === "pie" ? "ghost" : "outline"}
              onClick={() => setGraphType("pie")}
            >
              Pie Chart
            </Button>
            <Button
              variant={graphType === "scatter" ? "ghost" : "outline"}
              onClick={() => setGraphType("scatter")}
            >
              Scatter Plot
            </Button>
          </div>
          {transformedData && graphType === "line" && (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart
                width={500}
                height={300}
                data={transformedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray={"3 3"} />
                <XAxis dataKey={"index"} />
                <YAxis />
                <Tooltip />
                <Legend />
                {transformedData &&
                  transformedData.length > 0 &&
                  Object.keys(transformedData[0]).map((key, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={key}
                      stroke={colors[index]}
                    />
                  ))}
              </LineChart>
            </ChartContainer>
          )}
          {transformedData && graphType === "bar" && (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                width={500}
                height={300}
                data={transformedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray={"3 3"} />
                <XAxis dataKey={"index"} />
                <YAxis />
                <Tooltip />
                <Legend />
                {transformedData &&
                  transformedData.length > 0 &&
                  Object.keys(transformedData[0]).map((key, index) => (
                    <Bar
                      key={index}
                      dataKey={key}
                      fill={colors[index % colors.length]}
                    />
                  ))}
              </BarChart>
            </ChartContainer>
          )}
          {transformedData && graphType === "pie" && (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <PieChart width={500} height={300}>
                <Pie
                  data={readableData.map((item) => ({
                    name: item.row,
                    value: item.values.reduce((a: any, b: any) => a + b, 0),
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {readableData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartContainer>
          )}
          {transformedData && graphType === "scatter" && (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ScatterChart
                width={500}
                height={300}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid />
                <XAxis dataKey={"index"} type="number" name="index" />
                <YAxis dataKey="value" type="number" name="value" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Legend />
                {transformedData[0] &&
                  Object.keys(transformedData[0]).map((key, index) => (
                    <Scatter
                      key={index}
                      name={key}
                      data={transformedData.map((item, idx) => ({
                        index: idx,
                        value: item[key],
                      }))}
                      fill={colors[index % colors.length]}
                    />
                  ))}
              </ScatterChart>
            </ChartContainer>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
