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

const STATISTICS_FORMULAS: {
  [key: string]: string;
} = {
  mean: '\\text{mean} = \\frac{\\sum x}{n}',
  median: '\\text{median} = \\frac{n+1}{2}',
  mode: '\\text{mode} = \\text{value with the highest frequency}',
  std: '\\text{std} = \\sqrt{\\frac{\\sum (x - \\text{mean})^2}{n}}',
  variance: '\\text{variance} = \\frac{\\sum (x - \\text{mean})^2}{n}',
  range: '\\text{range} = \\max - \\min',
  min: '\\text{min} = \\text{minimum value}',
  max: '\\text{max} = \\text{maximum value}',
  count: '\\text{count} = \\text{number of elements}',
  sum: '\\text{sum} = \\text{sum of all elements}',
  corr: '\\text{corr} = \\frac{\\sum((x - \\text{mean}(x)) \\times (y - \\text{mean}(y)))}{\\sqrt{\\sum((x - \\text{mean}(x))^2) \\times \\sum((y - \\text{mean}(y))^2)}}'
}

export { STATISTIC_VARIABLES, API_URL_V1, SIMPLE_STATISTICS_OPTIONS, STATISTICS_FORMULAS };
