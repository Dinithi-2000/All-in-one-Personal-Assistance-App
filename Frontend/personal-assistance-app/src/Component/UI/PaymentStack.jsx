import React from "react";
import VisaCard from "./VisaCard";
import { CardStack } from "./card-stack";

export default function PaymentStack() {
  const cards = [
    {
      id: 1,
      content: (
        <VisaCard
          type="visa"
          cardName="Dini Gamage"
          cardNumber="xxxx xxxx xxxx xxxx"
          validDate="MM/DD"
        />
      ),
    },
    {
      id: 2,
      content: (
        <VisaCard
          type="master"
          cardName="Sonali Gamage"
          cardNumber="XXXX XXXX XXXX XXXX"
          validDate="MM/DD"
        />
      ),
    },
  ];
  return (
    <div className="mt-[20%] ml-[30%]">
      <CardStack items={cards} />
    </div>
  );
}
