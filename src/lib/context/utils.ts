export interface UserTemplate {
  full_name: string;
  email: string;
  phone_number: string;
  org_name: string;
  facility_name: string;
  facility_id: number;
  position: string;
}

export interface UserApiResponse {
  data: {
    templates: UserTemplate[];
  };
}

export interface UserContextType {
  user: UserTemplate | null;
  entries: any[];
  scopedEntries: any[];
  addedEntries: any[];
  isViewer: boolean;
  setIsViewer: React.Dispatch<React.SetStateAction<boolean>>;
  setScopedEntries: React.Dispatch<React.SetStateAction<any[]>>;
  setUser: React.Dispatch<React.SetStateAction<UserTemplate | null>>;
  setEntries: React.Dispatch<React.SetStateAction<any[]>>;
  setAddedEntries: React.Dispatch<React.SetStateAction<any[]>>;
}
