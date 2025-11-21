import { useEffect, useState } from "react";
import { client } from "../api";
import * as React from "react";
import type { Campaign } from "../../types/campaign";

interface CampaignFormProps {
  editing?: Campaign | null;
  onDone: () => void;
}
export default function CampaignForm({ editing, onDone }: CampaignFormProps) {
  const initial = { name: "", client: "", platform: "", budget: "", units: "" };
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        client: editing.client || "",
        platform: editing.platform || "",
        budget: editing.budget !== undefined ? String(editing.budget) : "",
        units: editing.budget !== undefined ? String(editing.budget) : ""
      });
    } else {
      setForm(initial);
    }
  }, [editing]);

  const margin = form.budget && form.units ? (Number(form.budget) / Number(form.units || 1)).toFixed(2) : "0.00";

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.client || !form.platform) {
      return alert("Fill name, client and platform");
    }
    if (!form.budget || Number(form.budget) < 0) return alert("Budget must be >= 0");
    if (!form.units || Number(form.units) <= 0) return alert("Units must be > 0");
    try {
      if (editing && editing.campaignId) {
        await client.put(`/campaigns/${editing.campaignId}`, form);
      } else {
        await client.post("/campaigns", form);
      }
      setForm(initial);
      onDone();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  return (
    <form onSubmit={submit} className="form">
      <h2>{editing ? "Edit Campaign" : "Create Campaign"}</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={onChange} />
      <input name="client" placeholder="Client" value={form.client} onChange={onChange} />
      <input name="platform" placeholder="Platform" value={form.platform} onChange={onChange} />
      <input name="budget" placeholder="Budget" value={form.budget} onChange={onChange} type="number" step="any" />
      <input name="units" placeholder="Units" value={form.units} onChange={onChange} type="number" step="any" />
      <div>Margin (live): {margin}</div>
      <button type="submit">{editing ? "Update" : "Create"}</button>
      {editing && <button type="button" onClick={() => onDone()}>Cancel</button>}
    </form>
  );
}
