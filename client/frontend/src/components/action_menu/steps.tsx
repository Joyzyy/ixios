import { API_URL_V1, STATISTICS_FORMULAS } from "@/constants";
import { useState, useEffect } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { identifiers } from "@/constants";
import DOMPurify from "dompurify";
import Markdown from "react-markdown";
import { LoadingSpinner } from "../ui/spinner";
import { useAtomValue } from "jotai";
import { currentActionAtom } from "@/features/atoms";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type TProps = {
  steps: any;
  type: string;
};

type TPropsStatistics = {
  steps: any;
};

const DescriptiveStatisticsSteps: React.FC<TPropsStatistics> = ({ steps }) => {
  return (
    <>
      {Object.keys(steps).map((key) => (
        <section key={key}>
          <h2 className="mb-4 text-3xl font-bold">
            Methods on variable: {key}
          </h2>
          {steps[key].map((_: any, idx: number) => (
            <div className="flex items-center space-x-2 mt-6" key={idx}>
              {Object.keys(steps[key][idx]).map((method) => (
                <section key={method} className="w-full">
                  <h3 className="text-xl font-semibold">{method}</h3>
                  <p className="rounded-lg border p-4 mt-2 mb-2 flex items-center">
                    <p className="font-mono">
                      <InlineMath>{STATISTICS_FORMULAS[method]}</InlineMath>
                    </p>
                  </p>
                  <div className="space-y-2">
                    {steps[key][idx][method][0].map(
                      (step: string, index: number) => (
                        <div
                          className="flex items-center space-x-2"
                          key={`${index}-${method}-${key}`}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full text-white bg-accent">
                            {index + 1}
                          </div>
                          <InlineMath
                            math={step.trim().replace(/\\\\/g, "\\")}
                          />
                        </div>
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>
          ))}
        </section>
      ))}
    </>
  );
};

const InferentialStatisticsSteps: React.FC<TPropsStatistics> = ({ steps }) => {
  const [interpretation, setInterpretation] = useState<any>({});
  const currentAction = useAtomValue(currentActionAtom);
  useEffect(() => {
    if (currentAction !== identifiers.INFERENTIAL_STATISTICS) return;
    Object?.keys(steps)?.map(async (key) => {
      try {
        // let completion = await fetch(`${API_URL_V1}/openai`, {
        //   method: "POST",
        //   body: JSON.stringify({
        //     model: "gpt-3.5-turbo",
        //     messages: [
        //       {
        //         role: "system",
        //         content: `You are going to interpret the results of the statistical data I have provided you. This is a ${key} test (made with statsmodels in python). Get straight to the interpretation and the conclusion of the interpretation. That's it. Also, provide a markdown format for the interpretation.`,
        //       },
        //       {
        //         role: "user",
        //         content: JSON.stringify(steps[key].steps),
        //       },
        //     ],
        //   }),
        // })
        //   .then((res) => {
        //     if (!res.ok) throw new Error("Failed to fetch completion");
        //     return res.json();
        //   })
        //   .then((data) => data)
        //   .catch((err) => {
        //     throw new Error(err);
        //   });
        let completion = Object();
        completion = completion?.response;
        if (completion) {
          if (completion.includes("```markdown")) {
            let newContent = completion.replace("```markdown", "");
            newContent = newContent.replace("```", "");
            completion = newContent;
          }
          setInterpretation((prevInterpretation: any) => ({
            ...prevInterpretation,
            [key]: completion,
          }));
        } else {
          setTimeout(() => {
            setInterpretation((prevInterpretation: any) => ({
              ...prevInterpretation,
              [key]: {
                message: "Failed to fetch completion from the server.",
                finished: true,
              },
            }));
          }, 2000);
        }
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      setInterpretation({});
    };
  }, [steps, currentAction]);

  return (
    <>
      {Object.keys(steps).map((key) => (
        <section key={key}>
          <h2 className="mb-4 text-2xl font-bold">{key}</h2>
          <div className="rounded-lg border p-4">
            <p className="font-mono">
              <InlineMath>{STATISTICS_FORMULAS[key]}</InlineMath>
            </p>
          </div>
          <div className="space-4 mt-2">
            <h3 className="text-lg font-semibold">Result of {key}:</h3>
            <div className="flex flex-col justify-center items-center space-y-2">
              {steps[key] &&
                steps[key].steps &&
                JSON.parse(steps[key].steps).html && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        JSON.parse(steps[key].steps).data
                      ),
                    }}
                  />
                )}
              {steps[key] &&
                steps[key].steps &&
                !JSON.parse(steps[key].steps).html && (
                  <InlineMath
                    math={JSON.parse(steps[key].steps)
                      .data.trim()
                      .replace(/\\\\/g, "\\")}
                  />
                )}
              {steps[key] &&
                steps[key].graphs &&
                JSON.parse(steps[key].graphs).label && (
                  <img
                    src={JSON.parse(steps[key].graphs).data}
                    alt={`${key} graph`}
                    loading="lazy"
                  />
                )}
            </div>
          </div>
          <h3 className="text-lg font-semibold">Interpretation</h3>
          <div className="rounded-lg border p-4">
            {!interpretation[key] ? (
              <LoadingSpinner className={"mx-auto"} />
            ) : (
              <Markdown key={key}>{interpretation[key].message}</Markdown>
            )}
          </div>
        </section>
      ))}
    </>
  );
};

const TimeSeriesAnalysisSteps: React.FC<TPropsStatistics> = ({ steps }) => {
  const [interpretation, setInterpretation] = useState<any>({});
  const currentAction = useAtomValue(currentActionAtom);

  useEffect(() => {
    if (!steps || currentAction !== identifiers.TIME_SERIES_ANALYSIS) return;
    Object?.keys(steps)?.map((key) => {
      steps[key].map(async (method: any) => {
        try {
          // let completion = await fetch(`${API_URL_V1}/openai`, {
          //   method: "POST",
          //   body: JSON.stringify({
          //     model: "gpt-3.5-turbo",
          //     messages: [
          //       {
          //         role: "system",
          //         content: `You are going to interpret the results of the statistical data I have provided you. This is a ${JSON.parse(method.steps).method} test (made with statsmodels in python) on the ${key} variable. Get straight to the interpretation and the conclusion of the interpretation. That's it. Also, provide a markdown format for the interpretation.`,
          //       },
          //       {
          //         role: "user",
          //         content: JSON.stringify(method.steps),
          //       },
          //     ],
          //   }),
          // })
          //   .then((res) => {
          //     if (!res.ok) throw new Error("Failed to fetch completion");
          //     return res.json();
          //   })
          //   .then((data) => data)
          //   .catch((err) => {
          //     throw new Error(err);
          //   });
          let completion = Object();
          completion = completion?.response;
          if (completion) {
            if (completion.includes("```markdown")) {
              let newContent = completion.replace("```markdown", "");
              newContent = newContent.replace("```", "");
              completion = newContent;
            }
            setInterpretation((prevInterpretation: any) => ({
              ...prevInterpretation,
              [key]: {
                message: completion,
                finished: true,
              },
            }));
          } else {
            setTimeout(() => {
              setInterpretation((prevInterpretation: any) => ({
                ...prevInterpretation,
                [key]: {
                  message: "Failed to fetch completion from the server.",
                  finished: true,
                },
              }));
            }, 2000);
          }
        } catch (err) {
          console.error(err);
        }
      });
    });
  }, [steps, currentAction]);

  return (
    <>
      {Object.keys(steps).map((key) => (
        <section key={key}>
          <h2 className="mb-4 text-3xl font-bold">
            Methods on variable: {key}
          </h2>
          {steps[key].map((method: any) => (
            <>
              <h3 className="text-xl font-semibold mb-2 mt-6">
                {JSON.parse(method.steps).method}
              </h3>
              <div className="rounded-lg border p-4 flex flex-row justify-center mb-2 mt-2 w-full">
                <ScrollArea className="max-h-[450px] w-full">
                  <div className="flex justify-center items-center">
                    {method &&
                      method.steps &&
                      JSON.parse(method.steps).html && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              JSON.parse(method.steps).data
                            ),
                          }}
                        />
                      )}
                    {method &&
                      method.steps &&
                      !JSON.parse(method.steps).html && (
                        <InlineMath math={JSON.parse(method.steps).data} />
                      )}
                  </div>
                  <hr className="mt-2 mb-2 w-full" />
                  <p className="font-mono">Interpretation</p>
                  {!interpretation[key] ? (
                    <LoadingSpinner className={"mx-auto"} />
                  ) : (
                    <Markdown key={key}>{interpretation[key].message}</Markdown>
                  )}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
              <div className="flex flex-row justify-center items-center">
                {method &&
                  method.graphs &&
                  JSON.parse(method.graphs).length > 0 &&
                  JSON.parse(method.graphs).map((graph: any) => (
                    <img src={graph.data} alt={`${key} graph`} loading="lazy" />
                  ))}
              </div>
            </>
          ))}
        </section>
      ))}
    </>
  );
};

export const StepsComponent: React.FC<TProps> = ({ steps, type }) => {
  const [stepsData, setStepsData] = useState<any>({});
  useEffect(() => {
    try {
      if (typeof steps === "string") {
        try {
          const dataString = steps.replace(/'/g, '"');
          const jsonString = dataString.replace(/\\/g, "\\\\");
          const stepsObj = JSON.parse(jsonString);
          setStepsData(stepsObj);
        } catch (err) {
          console.error(err);
        }
      } else {
        console.log("steps: ", steps);
        setStepsData(steps);
      }
    } catch (err) {
      console.error("err: ", err);
    }
  }, [steps]);

  return (
    <div className="mx-auto max-w-4xl px-6">
      <header className="mb-10 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-xl md:text-4xl">
          Statistical Result Walkthrough
        </h1>
        <p>
          Dive into the step-by-step calculations of the methods you've selected
        </p>
      </header>
      <div className="space-y-12">
        {type === identifiers.DESCRIPTIVE_STATISTICS ? (
          <DescriptiveStatisticsSteps steps={stepsData} />
        ) : type === identifiers.TIME_SERIES_ANALYSIS ? (
          <TimeSeriesAnalysisSteps steps={stepsData} />
        ) : (
          <InferentialStatisticsSteps steps={stepsData} />
        )}
      </div>
    </div>
  );
};
