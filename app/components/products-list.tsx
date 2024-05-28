import { round } from "~/utils/number";

import type { SettlementService } from "~/db/queries.server";

type ProductsListProps = {
  products: Exclude<
    Awaited<ReturnType<SettlementService["find"]>>,
    undefined
  >["products"];
};

export const ProductsList = ({ products }: ProductsListProps) => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-2">Produkter</h2>
      <div className="divide-y">
        {products.map((product) => (
          <div key={product.id} className="py-2 flex items-center">
            <div className="flex items-center gap-2 flex-1">
              <p className="text-gray-600 font-medium">{product.name}</p>
              <span className="text-sm text-gray-500">
                (
                {product.members.map((member) => member.member.name).join(", ")}
                )
              </span>
            </div>

            <p className="text-gray-600 font-medium">
              {round(product.price)} kr
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
