import { useEffect, useState } from "react";
import { client } from "../api";
import type { Campaign } from "../types/campaign";
import CampaignModal from "./CampaignModal";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Flex, Heading, Section, Table } from "@radix-ui/themes";

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
    <Section>
      <Flex justify="between" align="center" mb="4">
        <Heading as="h2">Campaigns List</Heading>

        <Button onClick={() => setCreating(!creating)}>
          <Plus size={18} />
          Create Campaign
        </Button>
      </Flex>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Client</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Platform</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Budget</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Units</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Margin</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((it) => (
              <Table.Row key={it.campaignId}>
                <Table.Cell>{it.name}</Table.Cell>
                <Table.Cell>{it.client}</Table.Cell>
                <Table.Cell>{it.platform}</Table.Cell>
                <Table.Cell>{it.budget}</Table.Cell>
                <Table.Cell>{it.units}</Table.Cell>
                <Table.Cell>{it.margin}</Table.Cell>
                <Table.Cell>
                  <Flex gap="3">
                    <Button onClick={() => setEditing(it)}>
                      <Pencil size={16} />
                    </Button>

                    <Button onClick={() => remove(it.campaignId)}>
                      <Trash2 size={16} />
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {/* Create Dialog */}
      <CampaignModal
        open={creating}
        title="Create Campaign"
        onOpenChange={setCreating}
        onDone={() => {
          setCreating(false);
          fetch();
        }}
      />

      {/* Edit Dialog */}
      <CampaignModal
        open={!!editing}
        title="Edit Campaign"
        editing={editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onDone={() => {
          setEditing(null);
          fetch();
        }}
      />
    </Section>
  );
}
