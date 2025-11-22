import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import CampaignList from "./components/CampaignList";
import CampaignForm from "./components/CampaignForm";
import type { Campaign } from "./types/campaign";

export default function App() {
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-950">
      <h1 className="text-5xl font-bold text-center mb-6 text-white">
        Campaign Manager
      </h1>

      <div className="shadow-md rounded-lg p-6 mb-6 bg-white">
        <CampaignList key={refreshToken} />
      </div>

      <Dialog.Root
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 bg-white p-6 rounded shadow -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
            <Dialog.Title className="text-xl font-bold mb-4">
              {editing ? "Edit Campaign" : "New Campaign"}
            </Dialog.Title>

            <CampaignForm
              editing={editing}
              onDone={() => {
                setEditing(null);
                setRefreshToken((t) => t + 1);
              }}
            />

            <Dialog.Close className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Close
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
