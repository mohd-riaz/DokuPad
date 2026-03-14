import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.bytes()),
    ownerId: v.string(),
    roomID: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    rightMargin: v.optional(v.number()),
    leftMargin: v.optional(v.number()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    }),
});
