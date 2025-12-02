import { Briefcase, Building2, Mail, MapPin, Phone, User } from "lucide-react";
export interface EmployeeState {
  employeeId: string;
  position: string;
  department: string;
  fullName: string;
  email: string;
  contact: string;
  organization: string;
  facility: string;
  facilityId: number;
  location: string;
}
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function toEmployeeDetails(state: EmployeeState) {
  return [
    { label: "Employee ID", value: state.employeeId, icon: <User size={14} /> },
    { label: "Position", value: state.position, icon: <Briefcase size={14} /> },
    { label: "Department", value: state.department, icon: <Building2 size={14} /> },
    { label: "Facility", value: state.facility, icon: <Building2 size={14} /> },
    { label: "Facility ID", value: state.facilityId, icon: <User size={14} /> },
    { label: "Location", value: state.location, icon: <MapPin size={14} /> },
    { label: "Organization", value: state.organization, icon: <Building2 size={14} /> },
    { label: "Email", value: state.email, icon: <Mail size={14} /> },
    { label: "Contact", value: state.contact, icon: <Phone size={14} /> },
  ];
}