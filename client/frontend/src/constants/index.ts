import type { Option } from "@/components/ui/multiple-selector";

const STATISTIC_VARIABLES = "ABCDEFGHIJKLMNOPQRSTUVWZYX".split("").reverse();

const API_URL_V1 = "http://localhost:8080/v1";

const SIMPLE_STATISTICS_OPTIONS: Option[] = [
  {
    label: "Mean",
    value: "mean",
  },
  {
    label: "Median",
    value: "median",
  },
  {
    label: "Mode",
    value: "mode",
  },
  {
    label: "Standard Deviation",
    value: "std",
  },
  {
    label: "Variance",
    value: "variance",
  },
  {
    label: "Range",
    value: "range",
  },
  {
    label: "Minimum",
    value: "min",
  },
  {
    label: "Maximum",
    value: "max",
  },
  {
    label: "Count",
    value: "count",
  },
  {
    label: "Sum",
    value: "sum",
  },
  {
    label: "Pearson correlation",
    value: "corr"
  }
];

export { STATISTIC_VARIABLES, API_URL_V1, SIMPLE_STATISTICS_OPTIONS };
