import { useEffect } from "react";

type TProps = {
  steps: string;
};

export const StepsComponent: React.FC<TProps> = ({ steps }) => {
  useEffect(() => {
    try {
      const dataString = steps.replace(/'/g, '"');
      const stepsObj = JSON.parse(dataString);
      console.info(stepsObj);
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
      <section>
        <h2 className="mb-4 text-2xl font-bold">Mean</h2>
        <div className="rounded-lg border p-4">
          <p className="font-mono">Mean = (Sum of all values) / (Total number of values)</p>
        </div>
        <div className="space-y-4 mt-2">
          <h3 className="text-lg font-semibold">Steps to calculate the mean:</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-white bg-accent">
                1
              </div>
              <p>Gather the data set you want to calculate the mean for.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
};
