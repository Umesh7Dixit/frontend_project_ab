import SideDrawer from "@/components/SideDrawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Template } from "@/types";

function getSelectedItemDetails(selectedItem: Template | null) {
  if (!selectedItem) {
    return { title: "", description: "", content: "" };
  }

  return {
    title: selectedItem.template_name,
    description: selectedItem.template_description,
    content: (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Created by:</span> {selectedItem.creator_name}</p>
        <p><span className="font-semibold">Created on:</span> {new Date(selectedItem.created_at).toLocaleDateString()}</p>
        <p><span className="font-semibold">Visibility:</span> {selectedItem.is_public ? "Public" : "Private"}</p>
      </div>
    ),
  };
}


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
