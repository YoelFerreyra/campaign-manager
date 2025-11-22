import { useEffect, useState } from "react";
import { client } from "../api";
import type { Campaign } from "../types/campaign";
import CampaignDialog from "./CampaignModal";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function CampaignList() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await client.get("/campaigns");
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const remove = async (id: string) => {
    if (!window.confirm("Delete campaign?")) return;
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
      <h2 className="text-2xl font-bold mb-4">Campaigns</h2>

      <button className="bg-green-500 text-white px-4 py-2 rounded mb-4 flex items-center gap-2" onClick={()=> setCreating(!creating)}>
        <Plus size={18} />
        Create Campaign
      </button>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Client</th>
              <th className="border px-2 py-1">Platform</th>
              <th className="border px-2 py-1">Budget</th>
              <th className="border px-2 py-1">Units</th>
              <th className="border px-2 py-1">Margin</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.campaignId}>
                <td className="border px-2 py-1">{it.name}</td>
                <td className="border px-2 py-1">{it.client}</td>
                <td className="border px-2 py-1">{it.platform}</td>
                <td className="border px-2 py-1">{it.budget}</td>
                <td className="border px-2 py-1">{it.units}</td>
                <td className="border px-2 py-1">{it.margin}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-2"
                    onClick={() => setEditing(it)}
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-2"
                    onClick={() => remove(it.campaignId)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create Dialog */}
      <CampaignDialog
        open={creating}
        title="Create Campaign"
        onOpenChange={setCreating}
        onDone={() => {
          setCreating(false);
          fetch();
        }}
      />

      {/* Edit Dialog */}
      <CampaignDialog
        open={!!editing}
        title="Edit Campaign"
        editing={editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onDone={() => {
          setEditing(null);
          fetch();
        }}
      />
    </div>
  );
}
