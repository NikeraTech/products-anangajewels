import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Ananga Jewels")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("product").title("All products"),
      S.listItem()
        .title("New arrivals")
        .child(S.documentList().title("New arrivals").filter('_type == "product" && isNew == true')),
      S.listItem()
        .title("In stock")
        .child(
          S.documentList()
            .title("In stock")
            .filter('_type == "product" && soldOut != true && coalesce(quantity, 0) > 0'),
        ),
      S.listItem()
        .title("Sold out")
        .child(
          S.documentList()
            .title("Sold out")
            .filter('_type == "product" && (soldOut == true || coalesce(quantity, 0) <= 0)'),
        ),
    ]);
