import type { Option } from "@/components/ui/multiple-selector";
import OpenAI from "openai";

const STATISTIC_VARIABLES = "ABCDEFGHIJKLMNOPQRSTUVWZXY".split("").reverse();

const NUMBER_PREDETERMINED = 2;

const API_URL_V1 = "https://joylunow.dev/v1";

const STATISTICS_FORMULAS: {
  [key: string]: string;
} = {
  mean: "\\text{mean} = \\frac{\\sum x}{n}",
  median: "\\text{median} = \\frac{n+1}{2}",
  mode: "\\text{mode} = \\text{value with the highest frequency}",
  std: "\\text{std} = \\sqrt{\\frac{\\sum (x - \\text{mean})^2}{n}}",
  variance: "\\text{variance} = \\frac{\\sum (x - \\text{mean})^2}{n}",
  range: "\\text{range} = \\max - \\min",
  min: "\\text{min} = \\text{minimum value}",
  max: "\\text{max} = \\text{maximum value}",
  count: "\\text{count} = \\text{number of elements}",
  sum: "\\text{sum} = \\text{sum of all elements}",
  corr: "\\text{corr} = \\frac{\\sum((x - \\text{mean}(x)) \\times (y - \\text{mean}(y)))}{\\sqrt{\\sum((x - \\text{mean}(x))^2) \\times \\sum((y - \\text{mean}(y))^2)}}",
  skewness: "\\text{skewness} = \\frac{\\sum(x - \\mu)^3}{n \\times \\sigma^3}",
  kurtosis: "\\text{kurtosis} = \\frac{\\sum(x - \\mu)^4}{n \\times \\sigma^4}",
  anova: "\\begin{matrix} \\\
    \\text{Source of variation} & \\text{Sum of squares} & \\text{Degrees of freedom} & \\text{Mean squares} & \\text{F Value} \\newline \\\
    \\text{Between groups} & \\text{SSB}=\\sum{n_i\\,(\\={a}_j-\\={a})^2} & df_1=k-1 & \\text{MSB}=SSB/(k-1) & \\text{F}=MSB/MSE \\newline \\\
    \\text{Error} & \\text{SSE}=\\sum{\\sum{(X-\\={a}_j)^2}} & df_2=N-k & \\text{MSE}=SSE/(N-k) \\newline \\\
    \\text{Total} & \\text{SST}=\\text{SSB}+\\text{SSE} & df_3=N-1 \\\
    \\end{matrix} \\\
  ",
  ols: "\\begin{matrix} \\\
    \\hat{\\alpha} = \\underset{\\alpha}{min} \\sum{(y_i-\\alpha-\\beta x_i)^2} = \\underset{\\alpha}{min} \\sum{\\varepsilon_i^2} \\newline \\\
    \\hat{\\beta} = \\underset{\\beta}{min} \\sum(y_i-\\alpha-\\beta x_i)^2 = \\underset{\\beta}{min} \\sum{\\varepsilon_i^2} \\\
    \\end{matrix} \\newline \\\
    \\text{where} \\newline \\\
    \\qquad \\hat{\\beta}= \\frac{\\sum{(x_i-\\bar{x})(y_i-\\bar{y})}}{\\sum{(x_i-\\bar{x})^2}} \\text{,} \\newline \\\
    \\qquad \\hat{\\alpha}= \\sum{y_i-\\bar{\\beta}x_i} \\newline \\\
    \\text{the equation being}: \\text{y}=\\hat{\\alpha}+\\hat{\\beta}x \\\
  ",
  white_test: "\\text{The hypothesis of White Test's are the following} \\newline \\\
    \\qquad \\Eta_0: \\text{Homoscedasticity} \\newline \\\
    \\qquad \\Eta_1: \\text{Heteroscedasticity} \\newline \\\
    \\text{The test statistic is given by} \\newline \\\
    \\qquad \\text{LM}=nR^2\\\
  ",
  jarque_bera: "\\text{The Jarque-Bera hypothesises are the following} \\newline \\\
    \\qquad \\Eta_0: \\text{Normality (S=0, K=3)} \\newline \\\
    \\qquad \\Eta_1: \\text{Non-normality (S!=0, K!=3)} \\newline \\\
    \\text{The test statistic is given by} \\newline \\\
    \\qquad JB=\\frac{n}{6}(S^2+\\frac{1}{4}(K-3)^2) \\\
  ",
  durbin_watson: "\\text{The Durbin-Watson hypothesises are the following} \\newline \\\
    \\qquad \\Eta_0: \\text{No autocorrelation} \\newline \\\
    \\qquad \\Eta_1: \\text{Positive autocorrelation} \\newline \\\
    \\qquad \\Eta_2: \\text{Negative autocorrelation} \\newline \\\
    \\text{The test statistic is given by} \\newline \\\
    \\qquad d=\\frac{\\sum_{t=2}^{T}(e_t-e_{t-1})^2}{\\sum_{t=1}^{T}e_t^2} \\\
  ",
  pearson_corr: "\\text{The Pearson correlation coefficient is given by} \\newline \\\
    \\qquad r=\\frac{\\sum{(x_i-\\bar{x})(y_i-\\bar{y})}}{\\sqrt{\\sum{(x_i-\\bar{x})^2}\\sum{(y_i-\\bar{y})^2}}} \\\
  ",
  spearman_corr: "\\text{The Spearman correlation coefficient is given by (eg. with 2 variables: Y and X)} \\newline \\\
    \\qquad r_s=1-\\frac{6\\sum{d_i^2}}{n(n^2-1)} \\\
    \\text{where} \\newline \\\
    \\qquad d_i=rank(x_i)-rank(y_i) \\\
  ",
};

export {
  STATISTIC_VARIABLES,
  API_URL_V1,
  STATISTICS_FORMULAS,
  NUMBER_PREDETERMINED,
};

export namespace options {
  export const DESCRIPTIVE_STATISTICS: Option[] = [
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
      label: "Variance",
      value: "variance",
    },
    {
      label: "Standard Deviation",
      value: "std",
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
      label: "Kurtosis",
      value: "kurtosis",
    },
    {
      label: "Skewness",
      value: "skewness",
    },
  ];

  export const INFERENTIAL_STATISTICS: Option[] = [
    {
      label: "ANOVA",
      value: "anova",
    },
    {
      label: "Regression",
      value: "ols",
    },
    {
      label: "White test",
      value: "white_test",
    },
    {
      label: "Jarque-Bera test",
      value: "jarque_bera",
    },
    {
      label: "Durbin-Watson test",
      value: "durbin_watson",
    },
    {
      label: "Pearson correlation (2 vars)",
      value: "pearson_corr",
    },
    {
      label: "Spearman correlation",
      value: "spearman_corr",
    }
  ];
};

export namespace identifiers {
  export const DESCRIPTIVE_STATISTICS = "Descriptive statistics";
  export const INFERENTIAL_STATISTICS = "Inferential statistics";
}