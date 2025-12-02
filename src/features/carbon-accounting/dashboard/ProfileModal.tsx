import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    name: string;
    role: string;
    org?: string;
    email?: string;
    contact?: string;
    image?: string;
  };
}

const ProfileModal: React.FC<UserDetailsModalProps> = ({
  open,
  onOpenChange,
  user,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-6" showCloseButton={false}>
        <DialogHeader className="hidden">
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Information about this team member
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 mt-4">
          <div className="h-40 w-32 rounded-lg bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-emerald-700">
                {user.name[0]}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <p className="font-semibold text-lg text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.role}</p>
              <p className="text-sm text-gray-500">
                Procurement / ESG / Finance
              </p>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium">Organization:</span>{" "}
                {user.org || "Malco / Balco / External"}
              </p>
              <p>
                <span className="font-medium">Role:</span> {user.role}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {user.email || "n/a"}
              </p>
              <p>
                <span className="font-medium">Contact:</span>{" "}
                {user.contact || "n/a"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
