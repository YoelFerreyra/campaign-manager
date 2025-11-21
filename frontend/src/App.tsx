import { useState } from "react";
import CampaignList from "./components/CampaignList";
import CampaignForm from "./components/CampaignForm";
import type { Campaign } from "../types/campaign";

export default function App() {
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <div className="container">
      <h1>Campaign Manager Pro</h1>
      <CampaignForm
        onDone={() => {
          setEditing(null);
          setRefreshToken((t) => t + 1);
        }}
        editing={editing}
      />
      <CampaignList
        key={refreshToken}
        onEdit={(c) => setEditing(c)}
      />
    </div>
  );
}
