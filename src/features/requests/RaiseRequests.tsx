"use client";

import React from "react";
import RequestHeader from "./components/Header";
import NewRequestForm from "./components/NewRequestForm";

const RaiseRequests = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <RequestHeader title="Raise a Request" />
      <NewRequestForm />
    </div>
  );
};

export default RaiseRequests;
