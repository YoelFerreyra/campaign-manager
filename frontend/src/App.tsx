import { useState } from "react";
import CampaignList from "./components/CampaignList";
import {
  Container,
  Flex,
  Heading,
  IconButton,
  Section,
  Theme,
  ThemePanel,
} from "@radix-ui/themes";
import { Moon, Sun } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  return (
    <Theme appearance={theme} accentColor="orange">
      <ThemePanel />
      <Container>
        <Flex justify="between" my="4">
          <Heading as="h1">Campaign Manager</Heading>
          <IconButton variant="ghost">
            {theme === "dark" ? (
              <Sun onClick={() => setTheme("light")} />
              ) : (
              <Moon onClick={() => setTheme("dark")} />
            )}
          </IconButton>
        </Flex>
        <Section>
          <CampaignList />
        </Section>
      </Container>
    </Theme>
  );
}
