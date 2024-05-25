import { TriangleAlert } from "lucide-react";
import { useSettlementStore } from "~/stores/settlement";

export const SummaryStep = () => {
  const { products, members, memberToProducts } = useSettlementStore();

  return (
    <div>
      <h2 className="text-gray-700 text-2xl mb-4">Oppsummering</h2>

      {memberToProducts.length === 0 && (
        <p className="bg-red-200 border-red-400 border-2 p-4 rounded-lg text-lg text-red-600 font-medium">
          <TriangleAlert className="h-6 w-6 inline-block mr-2" />
          Ingen har kjøpt noe enda
        </p>
      )}

      <div className="divide-y">
        {products.map((product) => {
          const buyers = memberToProducts
            .filter((mtp) => mtp.productId === product.id)
            .map((mtp) => members.find((member) => member.id === mtp.memberId));

          const pricePerPerson = product.price / buyers.length;

          return (
            <div
              key={product.id}
              className="py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-gray-600 text-lg font-medium">
                  {product.name}
                </h3>
                <span className="text-sm text-gray-400">
                  ({buyers.map((buyer) => buyer?.name).join(", ")})
                </span>
              </div>

              <p className="text-gray-600 text-lg font-medium">
                {pricePerPerson} kr
              </p>
            </div>
          );
        })}
      </div>

      <div className="py-4 flex flex-col">
        {/* Total per person */}

        {members.map((member) => {
          const total = memberToProducts
            .filter((mtp) => mtp.memberId === member.id)
            .reduce((acc, mtp) => {
              const product = products.find(
                (product) => product.id === mtp.productId
              );
              if (!product) return acc;

              return (
                acc +
                product.price /
                  memberToProducts.filter((mtp) => mtp.productId === product.id)
                    .length
              );
            }, 0);

          return (
            <div
              key={member.id}
              className="flex items-center justify-between gap-2"
            >
              <p className="text-gray-600 font-medium">{member.name}</p>
              <p className="text-gray-600 font-medium">{total} kr</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
