import React from "react";

export interface PageProps {
  params: Promise<{
    projectId?: number;
    requestId?: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface SideDrawerProps {
  open: boolean;
  onClose: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
}

export type Template = {
  template_id: number;
  template_name: string;
  template_description: string;
  is_public: boolean;
  creator_name: string;
  created_at: string;
};
