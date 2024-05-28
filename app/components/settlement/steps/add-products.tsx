import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFetcher } from "@remix-run/react";
import { Image, X, Undo2, Pencil, Check } from "lucide-react";
import { nanoid } from "nanoid";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";

import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/buttons";
import { Input } from "~/components/ui/input";
import { action } from "~/routes/image";
import { useSettlementStore, type Product } from "~/stores/settlement";
import { cn } from "~/utils/cn";

const schema = z.object({
  image: z.instanceof(File, { message: "Du må sende et bilde" }),
});

const UploadImageForm = () => {
  const { addProduct } = useSettlementStore();

  const ref = useRef<HTMLInputElement>(null);

  const fetcher = useFetcher<typeof action>({
    key: "image-to-products",
  });

  const [form, fields] = useForm({
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema });
    },
  });

  useEffect(() => {
    if (fetcher.data) {
      // TODO: Remove me

      console.log(fetcher.data);

      fetcher.data.forEach((product) => {
        addProduct({
          id: nanoid(),
          name: product.name,
          price: +product.price,
        });
      });
    }
  }, [addProduct, fetcher.data]);

  return (
    <fetcher.Form
      className="border-2 rounded-lg p-4 mb-8 space-y-4"
      encType="multipart/form-data"
      action="/image"
      method="post"
      {...getFormProps(form)}
    >
      <button
        onClick={() => {
          ref.current?.click();
        }}
        className="flex mx-auto text-gray-300 hover:text-gray-400 transition-colors"
      >
        <Image className="h-16 w-16" />
      </button>
      <input
        ref={ref}
        className="hidden"
        type="file"
        id="image"
        name="image"
        accept="image/jpeg, image/png"
      />

      <p className="text-center text-gray-500">
        {fields.image.value ? fields.image.value.name : "Last opp et bilde"}
      </p>

      <div className="flex items-center gap-2 mx-auto w-fit">
        <Button
          className={cn({
            "cursor-not-allowed opacity-50": fetcher.state === "submitting",
          })}
          type="submit"
        >
          {fetcher.state === "submitting"
            ? "Scanner kvittering..."
            : "Scan kvittering"}
        </Button>
        <Button intent="danger" className="h-8 w-8" type="reset">
          <Undo2 className="h-4 w-4" />
        </Button>
      </div>
    </fetcher.Form>
  );
};

type ProductListItemProps = {
  product: Product;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  const { removeProduct, updateProduct } = useSettlementStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateName = (name: string) => {
    updateProduct(product.id, { name, price: product.price });
  };

  const handleUpdatePrice = (price: string) => {
    const value = Number(price);
    if (isNaN(value)) {
      return;
    }

    updateProduct(product.id, { name: product.name, price: value });
  };

  return (
    <div className="py-2 flex group items-center gap-4">
      <div className="flex-1">
        {!isEditing ? (
          <p className="text-gray-600 font-medium">
            {product.name} &mdash; {product.price} kr
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={product.name}
              className="flex-1"
              placeholder="Navn..."
              onChange={(e) => handleUpdateName(e.target.value)}
            />
            <Input
              value={product.price}
              className="max-w-[70px]"
              type="number"
              placeholder="Pris..."
              onChange={(e) => handleUpdatePrice(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="hidden group-hover:block text-gray-400 hover:text-blue-400 transition-all duration-300"
        >
          {isEditing ? (
            <Check className="h-5 w-5" />
          ) : (
            <Pencil className="h-5 w-5" />
          )}
        </button>
        <button
          onClick={() => removeProduct(product.id)}
          className="text-gray-400 hover:text-red-400 transition-colors duration-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export const AddProductsStep = () => {
  const { members, products, addProduct } = useSettlementStore();
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
      {members.length === 0 && (
        <Alert intent="warning" className="mb-4">
          Du har ikke lagt til noen brukere.
        </Alert>
      )}

      <h2 className="text-gray-700 text-2xl mb-4">Legg til produkter</h2>

      <UploadImageForm />

      <div className="mb-8">
        {products.length > 0 && (
          <div className="divide-y">
            {products.map((product) => (
              <ProductListItem key={product.id} product={product} />
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
