// Plan and fuel decisions are independent of each other (two-phase approval, BR-06)
export type DecisionKind = "plan" | "fuel";

export type PendingDecision = "approve" | "reject";
