import { useEffect, useState } from "react";
import { client } from "../api";
import type { Campaign } from "../types/campaign";
import { Button, Flex, TextField } from "@radix-ui/themes";
import { toast } from "sonner";

interface CampaignFormProps {
  editing?: Campaign | null;
  onDone: () => void;
}

export default function CampaignForm({ editing, onDone }: CampaignFormProps) {
  const initial = { name: "", client: "", platform: "", budget: "", units: "" };
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function validate() {
    const newErrors: { [key: string]: string } = {};
  
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.client.trim()) newErrors.client = "Client is required";
    if (!form.platform.trim()) newErrors.platform = "Platform is required";
  
    if (!form.budget || Number(form.budget) < 0)
      newErrors.budget = "Budget must be ≥ 0";
  
    if (!form.units || Number(form.units) <= 0)
      newErrors.units = "Units must be > 0";
  
    return newErrors;
  }

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        client: editing.client || "",
        platform: editing.platform || "",
        budget: editing.budget !== undefined ? String(editing.budget) : "",
        units: editing.units !== undefined ? String(editing.units) : "",
      });
    } else {
      setForm(initial);
    }
  }, [editing]);

  const margin =
    form.budget && form.units
      ? (Number(form.budget) / Number(form.units || 1)).toFixed(2)
      : "0.00";

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
  
    if (Object.keys(validation).length > 0) return;

    try {
      if (editing && editing.campaignId) {
        await client.put(`/campaigns/${editing.campaignId}`, form);
      } else {
        await client.post("/campaigns", form);
      }
      setForm(initial);
      onDone();
      toast.success("Submission successful");
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    }
  }

  return (
    <form onSubmit={submit}>
      <TextField.Root
        placeholder="Name"
        name="name"
        value={form.name}
        onChange={onChange}
        className={errors.name ? "border border-red-500" : ""}
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <TextField.Root
        placeholder="Client"
        name="client"
        value={form.client}
        onChange={onChange}
        className={errors.client ? "border border-red-500" : ""}
        mt="2"
      />
      {errors.client && <p className="text-red-500 text-sm">{errors.client}</p>}

      <TextField.Root
        placeholder="Platform"
        name="platform"
        value={form.platform}
        onChange={onChange}
        className={errors.platform ? "border border-red-500" : ""}
        mt="2"
      />
      {errors.platform && (
        <p className="text-red-500 text-sm">{errors.platform}</p>
      )}

      <TextField.Root
        placeholder="Budget"
        name="budget"
        value={form.budget}
        onChange={onChange}
        type="number"
        className={errors.budget ? "border border-red-500" : ""}
        mt="2"
      />
      {errors.budget && (
        <p className="text-red-500 text-sm">{errors.budget}</p>
      )}

      <TextField.Root
        placeholder="Units"
        name="units"
        value={form.units}
        onChange={onChange}
        type="number"
        className={errors.units ? "border border-red-500" : ""}
        mt="2"
      />
      {errors.units && <p className="text-red-500 text-sm">{errors.units}</p>}

      <div style={{ marginTop: 10 }}>Margin (live): {margin}</div>

      <Flex justify="between" my="4">
        <Button type="submit">{editing ? "Update" : "Create"}</Button>
      </Flex>
    </form>
  );
}
