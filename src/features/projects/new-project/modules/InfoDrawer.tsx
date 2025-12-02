"use client";

import SideDrawer from "@/components/SideDrawer";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-separator";
import React from "react";

const getSelectedItemDetails = (selectedItem: string) => {
  switch (selectedItem) {
    case "BURSA":
      return {
        title: "BURSA",
        description: "Carbon trading & reports",
        content: (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              BURSA Malaysia is a trading platform for carbon credits. Companies
              can buy, sell, or offset carbon units here.
            </p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Access carbon credit auctions</li>
              <li>Generate compliance & voluntary reports</li>
              <li>Track credit prices and trends</li>
            </ul>
          </div>
        ),
      };

    case "GHG Carbon Accounting":
      return {
        title: "GHG Carbon Accounting",
        description: "Track emissions by scope",
        content: (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Core greenhouse gas accounting system aligned with the{" "}
              <strong>GHG Protocol</strong>.
            </p>
            <ul className="list-disc ml-4 space-y-1">
              <li>
                Record Scope 1 (direct), Scope 2 (energy), Scope 3 (value chain)
                emissions
              </li>
              <li>Attach emission factors for calculations</li>
              <li>Generate reports for compliance and disclosures</li>
            </ul>
          </div>
        ),
      };

    case "LCA":
      return {
        title: "LCA",
        description: "Lifecycle impact analysis",
        content: (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Life Cycle Assessment (LCA) evaluates environmental impact across
              the product or service lifecycle — from raw materials to disposal.
            </p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Model cradle-to-grave product impacts</li>
              <li>Identify carbon hotspots in supply chains</li>
              <li>Compare design options for sustainability</li>
            </ul>
          </div>
        ),
      };

    case "CBAM":
      return {
        title: "CBAM",
        description: "Carbon Border Adjustment Mechanism",
        content: (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              EU’s Carbon Border Adjustment Mechanism (CBAM) requires carbon
              reporting for certain imports into Europe.
            </p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Calculate embedded carbon in exported goods</li>
              <li>Generate CBAM-compliant declarations</li>
              <li>Stay compliant with EU carbon border policies</li>
            </ul>
          </div>
        ),
      };

    case "SGX":
      return {
        title: "SGX",
        description: "Sustainability Exchange",
        content: (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Singapore Exchange (SGX) sustainability module links ESG data and
              climate disclosures for listed companies.
            </p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Prepare ESG reports aligned with SGX rules</li>
              <li>Upload climate risk and sustainability data</li>
              <li>Benchmark performance against peers</li>
            </ul>
          </div>
        ),
      };

    case "MSPO":
      return {
        title: "MSPO",
        description: "Malaysian Sustainable Palm Oil Certification",
        content: (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              MSPO certification ensures palm oil is produced sustainably,
              covering environmental, social, and governance (ESG) practices.
            </p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Track compliance with MSPO standards</li>
              <li>Monitor plantation emissions and practices</li>
              <li>Generate reports for certification audits</li>
            </ul>
          </div>
        ),
      };

    default:
      return {
        title: "Details",
        description: "No information available.",
        content: (
          <p className="text-sm text-muted-foreground">
            No details found for this module.
          </p>
        ),
      };
  }
};

const InfoDrawer = ({ open, onClose, selectedItem }: any) => {
  const { title, description, content } = getSelectedItemDetails(
    selectedItem ?? ""
  );

  return (
    <SideDrawer open={open} onClose={onClose} title={title}>
      <ScrollArea className="h-full p-4 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Separator className="my-3" />
          {content}
        </div>
      </ScrollArea>
    </SideDrawer>
  );
};

export default InfoDrawer;
