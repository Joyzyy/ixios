import { STATISTICS_FORMULAS } from "@/constants";
import { useState, useEffect } from "react";
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

type TProps = {
  steps: string;
};

export const StepsComponent: React.FC<TProps> = ({ steps }) => {
  const [stepsData, setStepsData] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    try {
      const dataString = steps.replace(/'/g, '"');
      const stepsObj = JSON.parse(dataString) as { [key: string]: string };
      setStepsData(stepsObj);
    } catch (err) {
      console.error('err: ', err);
    }
  }, [steps]);

  return <div className="mx-auto max-w-4xl px-6">
    <header className="mb-10 space-y-2 text-center">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-xl md:text-4xl">Statistical Result Walkthrough</h1>
      <p>
        Dive into the step-by-step calculations of the methods you've selected
      </p>
    </header>
    <div className="space-y-12">
      {Object.keys(stepsData).map((key) => (
        <section key={key}>
          <h2 className="mb-4 text-2xl font-bold">{key}</h2>
          <div className="rounded-lg border p-4">
            <p className="font-mono">Formula: <InlineMath>{STATISTICS_FORMULAS[key]}</InlineMath></p>
          </div>
          <div className="space-y-4 mt-2">
            <h3 className="text-lg font-semibold">Steps to calculate {key}:</h3>
            <div className="space-y-2">
              {stepsData[key].length === 0 && <p>No steps available</p>}
              {Object.keys(stepsData[key]).map((step, index) => (
                <div className="flex items-center space-x-2" key={index}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-white bg-accent">
                    {index + 1}
                  </div>
                  {stepsData[key][index].split('Formula: ').length > 1 ? (
                    <p>{stepsData[key][index].split('Formula: ')[0]} Formula: <InlineMath>{stepsData[key][index].split('Formula: ')[1]}</InlineMath></p>
                  ) : (
                    <p>{stepsData[key][index]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  </div>
};
