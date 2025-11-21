import { useEffect, useState } from "react";
import { client } from "../api";
import type { Campaign } from "../../types/campaign";

interface CampaignListProps {
  onEdit: (c: Campaign) => void;
}

export default function CampaignList({ onEdit }:  CampaignListProps) {
  const [items, setItems] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await client.get("/campaigns");
      console.log("res", res);
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete campaign?")) return;
    try {
      await client.delete(`/campaigns/${id}`);
      fetch();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2>Campaigns</h2>
      {loading ? <div>Loading...</div> : (
        <table>
          <thead>
            <tr><th>Name</th><th>Client</th><th>Platform</th><th>Budget</th><th>Units</th><th>Margin</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.campaignId}>
                <td>{it.name}</td>
                <td>{it.client}</td>
                <td>{it.platform}</td>
                <td>{it.budget}</td>
                <td>{it.units}</td>
                <td>{it.margin}</td>
                <td>
                  <button onClick={() => onEdit(it)}>Edit</button>
                  <button onClick={() => remove(it.campaignId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
