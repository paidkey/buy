"use client";

import { useState } from "react";
import PricingSection, { type PlanId } from "./PricingSection";
import RequestForm from "./RequestForm";

export default function PricingAndRequest() {
  const [selectedPlan, setSelectedPlan] = useState<{
    id: PlanId;
    label: string;
    price: string;
  } | null>(null);

  return (
    <>
      <PricingSection onSelectPlan={setSelectedPlan} />
      <RequestForm selectedPlan={selectedPlan} />
    </>
  );
}
