import * as Dialog from "@radix-ui/react-dialog";
import CampaignForm from "./CampaignForm";
import type { Campaign } from "../types/campaign";

interface Props {
  open: boolean;
  title: string;
  editing?: Campaign | null;
  onOpenChange: (v: boolean) => void;
  onDone: () => void;
}

export default function CampaignDialog({ open, title, editing, onOpenChange, onDone }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 bg-white p-6 rounded shadow -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
          <Dialog.Title className="text-xl font-bold mb-4">{title}</Dialog.Title>

          <CampaignForm editing={editing} onDone={onDone} />

          <Dialog.Close className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
