import { Alert } from "~/components/ui/alert";
import { useSettlementStore } from "~/stores/settlement";
import { round } from "~/utils/number";

export const SummaryStep = () => {
  const { products, members, memberToProducts } = useSettlementStore();

  return (
    <div>
      {memberToProducts.length === 0 && (
        <Alert intent="warning" className="mb-4">
          Du har ikke fordelt noen varer.
        </Alert>
      )}

      <h2 className="text-gray-700 text-2xl mb-4">Oppsummering</h2>

      <div className="divide-y">
        {products.map((product) => {
          const buyers = memberToProducts
            .filter((mtp) => mtp.productId === product.id)
            .map((mtp) => members.find((member) => member.id === mtp.memberId));

          const pricePerPerson = round(product.price / (buyers.length || 1));

          return (
            <div
              key={product.id}
              className="py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-gray-600 text-lg font-medium">
                  {product.name}
                </h3>
                {buyers.length ? (
                  <span className="text-sm text-gray-400">
                    ({buyers.map((buyer) => buyer?.name).join(", ")})
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">(ikke fordelt)</span>
                )}
              </div>

              <p className="text-gray-600 text-lg font-medium">
                {pricePerPerson} kr
              </p>
            </div>
          );
        })}
      </div>

      <div className="py-4 flex flex-col">
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
              <p className="text-gray-600 font-medium">{round(total)} kr</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
