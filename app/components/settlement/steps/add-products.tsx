import { X } from "lucide-react";
import { nanoid } from "nanoid";
import { useState, useRef } from "react";
import { Button } from "~/components/ui/buttons";
import { Input } from "~/components/ui/input";
import { useSettlementStore } from "~/stores/settlement";

export const AddProductsStep = () => {
  const { products, addProduct, removeProduct } = useSettlementStore();
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  const total = products.reduce((acc, product) => acc + product.price, 0);

  const handleAddProduct = () => {
    if (!name) {
      nameInputRef.current?.focus();
      return;
    }
    if (!price) {
      priceInputRef.current?.focus();
      return;
    }

    addProduct({
      id: nanoid(),
      name,
      price,
    });

    setName("");
    setPrice(0);
    nameInputRef.current?.focus();
  };

  return (
    <div>
      <h2 className="text-gray-700 text-2xl mb-4">Legg til produkter</h2>

      <div className="mb-8">
        {products.length === 0 ? (
          <p className="text-gray-600 text-center text-xl font-medium">
            Ingen produkter lagt til
          </p>
        ) : (
          <div className="divide-y">
            {products.map((product) => (
              <div key={product.id} className="py-2 flex items-center">
                <p className="text-gray-600 font-medium flex-1">
                  {product.name} &mdash; {product.price} kr
                </p>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-gray-600 text-lg font-medium mb-2">
        Totalt: {total} kr
      </p>

      <div className="flex items-center gap-2">
        <Input
          ref={nameInputRef}
          value={name}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              priceInputRef.current?.focus();
              priceInputRef.current?.select();
            }
          }}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
          placeholder="Navn..."
        />
        <Input
          ref={priceInputRef}
          value={price}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddProduct();
            }
          }}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (isNaN(value)) {
              return setPrice(undefined);
            }

            setPrice(+value);
          }}
          className="max-w-[70px]"
          type="number"
          placeholder="Pris..."
        />
        <Button onClick={handleAddProduct}>Legg til</Button>
      </div>
    </div>
  );
};
