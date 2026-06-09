import { TableAggregate } from "@convex-dev/aggregate";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

export const recordCountAggregate = new TableAggregate<{
  Namespace: string;
  Key: number;
  DataModel: DataModel;
  TableName: "records";
}>(components.recordCounts, {
  namespace: (doc) => doc.category,
  sortKey: (doc) => doc._creationTime,
});
