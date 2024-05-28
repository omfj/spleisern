import { getDB } from "./client.server";
import { settlements, products, members, membersToProducts } from "./schemas";
import { SettlementState } from "~/stores/settlement";

type Database = ReturnType<typeof getDB>;

export class SettlementService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  findAllByUserId = async (userId: string) => {
    return await this.db.query.settlements.findMany({
      where: (settlement, { eq }) => eq(settlement.owner, userId),
      orderBy: (settlement, { desc }) => [desc(settlement.createdAt)],
    });
  };

  find = async (id: string) => {
    return await this.db.query.settlements.findFirst({
      where: (settlement, { eq }) => eq(settlement.id, id),
      with: {
        products: {
          with: {
            members: {
              with: {
                member: true,
              },
            },
          },
        },
        members: true,
      },
    });
  };

  add = async (
    settlementId: string,
    userId: string,
    settlement: SettlementState
  ) => {
    await this.db.batch([
      this.db.insert(settlements).values({
        id: settlementId,
        name: settlement.name,
        isPublic: true,
        owner: userId,
      }),
      this.db.insert(products).values(
        settlement.products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          settlementId,
        }))
      ),
      this.db.insert(members).values(
        settlement.members.map((member) => ({
          id: member.id,
          name: member.name,
          settlementId,
        }))
      ),
      this.db.insert(membersToProducts).values(
        settlement.memberToProducts.map((relation) => ({
          memberId: relation.memberId,
          productId: relation.productId,
          settlementId,
        }))
      ),
    ]);
  };
}
