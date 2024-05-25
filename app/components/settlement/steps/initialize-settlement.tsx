import { Input } from "~/components/ui/input";
import { useSettlementStore } from "~/stores/settlement";

export const InitializeSettlementStep = () => {
  const { name, setName } = useSettlementStore();

  return (
    <div>
      <h2 className="text-gray-700 text-2xl mb-4">Oppsett</h2>
      <p className="text-gray-600 text-lg mb-8">
        Her kan du legge til medlemmer og produkter som skal være med i
        oppgjøret.
      </p>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Navn på oppgjøret
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          placeholder="F.eks. Hyttetur"
        />
      </div>
    </div>
  );
};
