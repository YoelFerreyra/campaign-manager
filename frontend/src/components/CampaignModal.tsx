import { Button, Dialog }   from "@radix-ui/themes";
import CampaignForm from "./CampaignForm";
import type { Campaign } from "../types/campaign";

interface Props {
  open: boolean;
  title: string;
  editing?: Campaign | null;
  onOpenChange: (v: boolean) => void;
  onDone: () => void;
}

export default function CampaignModal({ open, title, editing, onOpenChange, onDone }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>

        <Dialog.Content>
          <Dialog.Title>{title}</Dialog.Title>

          <CampaignForm editing={editing} onDone={onDone} />

          <Dialog.Close>
            <Button variant="outline">
              Close
            </Button>
          </Dialog.Close>
        </Dialog.Content>
    </Dialog.Root>
  );
}
