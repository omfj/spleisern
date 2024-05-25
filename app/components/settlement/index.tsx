import React, { useEffect } from "react";
import { Button } from "../ui/buttons";
import { Stepper, Step } from "../ui/stepper";
import { AddMembersStep } from "./steps/add-member";
import { AddProductsStep } from "./steps/add-products";
import { AddRelationsStep } from "./steps/add-relations";
import { useLocalStorage } from "~/hooks/use-local-storage";
import { SummaryStep } from "./steps/summary";
import { InitializeSettlementStep } from "./steps/initialize-settlement";
import { useSettlementStore } from "~/stores/settlement";
import { Form, redirect, useActionData } from "@remix-run/react";
import { action } from "~/routes/__auth.opprett";

const STEPS = 5;

export const Settlement = () => {
  const actionData = useActionData<typeof action>();
  const { name, members, products, memberToProducts, reset } =
    useSettlementStore();
  const [activeStep, setActiveStep] = useLocalStorage("activeStep", 0);

  const incrementStep = () => setActiveStep(activeStep + 1);
  const decrementStep = () => setActiveStep(activeStep - 1);

  const settlement = {
    name,
    members,
    products,
    memberToProducts,
  };

  useEffect(() => {
    if (actionData && actionData.success) {
      reset();
      setActiveStep(0);
      redirect(`/oppgjor/${actionData.id}`);
    }
  }, [actionData, reset, setActiveStep]);

  return (
    <>
      <Stepper className="mb-8 mx-auto">
        {Array.from({ length: STEPS }).map((_, index) => {
          const isActive = index <= activeStep;

          return (
            <button key={index} onClick={() => setActiveStep(index)}>
              <Step step={index} isActive={isActive} />
            </button>
          );
        })}
      </Stepper>

      <Steps activeStep={activeStep}>
        <InitializeSettlementStep />
        <AddMembersStep />
        <AddProductsStep />
        <AddRelationsStep />
        <SummaryStep />
      </Steps>

      <div className="mt-8 flex items-center justify-between">
        {activeStep > 0 && (
          <Button onClick={decrementStep} className="w-fit">
            Tilbake
          </Button>
        )}
        {activeStep < STEPS - 1 && (
          <Button onClick={incrementStep} className="w-fit">
            Neste
          </Button>
        )}

        {activeStep === STEPS - 1 && (
          <Form method="post">
            <input
              type="hidden"
              name="settlement"
              value={JSON.stringify(settlement)}
            />
            <Button type="submit" className="w-fit">
              Lagre
            </Button>
          </Form>
        )}
      </div>
    </>
  );
};

type StepsProps = {
  activeStep: number;
  children: React.ReactNode;
};

const Steps = ({ activeStep, children }: StepsProps) => {
  return React.Children.toArray(children)[activeStep] ?? null;
};