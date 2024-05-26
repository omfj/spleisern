import { Alert } from "~/components/ui/alert";
import { Checkbox } from "~/components/ui/checkbox";
import { useSettlementStore } from "~/stores/settlement";

export const AddRelationsStep = () => {
  const {
    products,
    members,
    memberToProducts,
    addMemberToProduct,
    removeMemberFromProduct,
  } = useSettlementStore();

  const relationExists = (productId: string, memberId: string) =>
    memberToProducts.some(
      (mtp) => mtp.productId === productId && mtp.memberId === memberId
    );

  const toggleBuyer = (productId: string, memberId: string) => {
    const exists = relationExists(productId, memberId);

    if (exists) {
      return removeMemberFromProduct({
        productId,
        memberId,
      });
    }

    return addMemberToProduct({
      productId,
      memberId,
    });
  };

  return (
    <div>
      {products.length === 0 && (
        <Alert intent="warning" className="mb-4">
          Du har ikke lagt til noen varer.
        </Alert>
      )}

      <h2 className="text-gray-700 text-2xl mb-4">Hvem har kjøpt hva?</h2>

      <div className="divide-y">
        {products.map((product) => {
          return (
            <div key={product.id} className="py-2">
              <h3 className="text-gray-600 text-lg font-medium mb-2">
                {product.name}
              </h3>

              <ul>
                {members.map((member) => {
                  const name = `${product.id}-${member.id}`;
                  const exists = relationExists(product.id, member.id);
                  const toggle = () => {
                    console.log("toggle", product.id, member.id);
                    toggleBuyer(product.id, member.id);
                  };

                  return (
                    <li key={member.id} className="pl-4 flex items-center">
                      <label
                        htmlFor={name}
                        className="text-gray-600 font-medium flex-1"
                      >
                        {member.name}
                      </label>

                      <Checkbox
                        id={name}
                        name={name}
                        checked={exists}
                        onChange={toggle}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
