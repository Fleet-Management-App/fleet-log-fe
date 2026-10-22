import type { FC } from "react";

import { motion } from "motion/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";

// Placeholder until the role dashboards (Driver / Fleet Manager / Accountant) are built.
export const DashboardPage: FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    <Card>
      <CardHeader>
        <CardTitle>FleetLog</CardTitle>
        <CardDescription>Digital trip logbook for your fleet.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Scaffold is running. Feature modules live in <code>src/modules/</code>.
      </CardContent>
    </Card>
  </motion.div>
);
