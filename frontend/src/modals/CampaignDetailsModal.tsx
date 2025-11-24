import { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/themes";
import { Box, Card, Flex, Text, Button, Grid } from "@radix-ui/themes";
import { client } from "../api";
import type { Campaign } from "../types/campaign";

export default function CampaignDetailsModal({
  id,
  open,
  onClose,
}: {
  id: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCampaign = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await client.get(`/campaigns/${id}`);
      setCampaign(res.data);
    } catch (err) {
      console.error("Failed to load campaign", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchCampaign();
  }, [open, id]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Campaign Details</Dialog.Title>

        {loading && <Text>Loading...</Text>}

        {!loading && campaign && (
          <Box>
            <Card>
              <Flex direction="column" gap="3">
                <Grid gap="1">
                  <Text weight="bold">Name</Text>
                  <Text>{campaign.name}</Text>
                </Grid>

                <Grid gap="1">
                  <Text weight="bold">Client</Text>
                  <Text>{campaign.client}</Text>
                </Grid>

                <Grid gap="1">
                  <Text weight="bold">Platform</Text>
                  <Text>{campaign.platform}</Text>
                </Grid>

                <Grid gap="1">
                  <Text weight="bold">Budget</Text>
                  <Text>${campaign.budget}</Text>
                </Grid>

                <Grid gap="1">
                  <Text weight="bold">Units</Text>
                  <Text>{campaign.units}</Text>
                </Grid>

                <Grid gap="1">
                  <Text weight="bold">Margin</Text>
                  <Text>{campaign.margin}%</Text>
                </Grid>
              </Flex>
            </Card>
          </Box>
        )}

        <Flex justify="end" mt="4">
          <Button variant="soft" onClick={onClose}>
            Close
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
