
import { Box, Card, Flex, Text, Button, Dialog } from "@radix-ui/themes";

export default function DeleteConfirmModal({
  campaign,
  open,
  onClose,
  onConfirm,
}: {
  campaign: { campaignId: string; name: string } | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(value) => !value && onClose()}>
        <Dialog.Content>
          <Dialog.Title>
            Confirm Delete
          </Dialog.Title>

          {campaign && (
            <Card>
              <Box>
                <Text>
                  Are you sure you want to delete the campaign{" "}
                  <strong>{campaign.name}</strong>?
                </Text>
                  <br />
                <Text color="red" size="2">
                  This action cannot be undone.
                </Text>
              </Box>
            </Card>
          )}

          <Flex justify="end" gap="3" mt="4">
            <Button variant="soft" onClick={onClose}>
              Cancel
            </Button>

            <Button
              color="red"
              onClick={() => {
                if (campaign) onConfirm(campaign.campaignId);
              }}
            >
              Delete
            </Button>
          </Flex>
        </Dialog.Content>
    </Dialog.Root>
  );
}
