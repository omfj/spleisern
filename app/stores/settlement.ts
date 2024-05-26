import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Member = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
};

type MemberToProduct = {
  memberId: string;
  productId: string;
};

export type SettlementState = {
  name: string;
  members: Array<Member>;
  products: Array<Product>;
  memberToProducts: Array<MemberToProduct>;
};

type SettlementActions = {
  reset: () => void;

  setName: (name: string) => void;

  addMember: (member: Member) => void;
  removeMember: (id: string) => void;

  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;

  addMemberToProduct: (memberToProduct: MemberToProduct) => void;
  removeMemberFromProduct: (memberToProduct: MemberToProduct) => void;
};

export const initialSettlementState: SettlementState = {
  name: "",
  members: [],
  products: [],
  memberToProducts: [],
};

export const useSettlementStore = create<SettlementState & SettlementActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialSettlementState,

        reset: () => set(initialSettlementState),

        setName: (name) => set({ name }),

        addMember: (member) =>
          set((state) => ({ members: [...state.members, member] })),

        removeMember: (id) => {
          set((state) => ({
            memberToProducts: state.memberToProducts.filter(
              (mtp) => mtp.memberId !== id
            ),
          }));

          return set((state) => ({
            members: state.members.filter((member) => member.id !== id),
          }));
        },

        addProduct: (product) =>
          set((state) => ({ products: [...state.products, product] })),

        removeProduct: (id) => {
          set((state) => ({
            memberToProducts: state.memberToProducts.filter(
              (mtp) => mtp.productId !== id
            ),
          }));

          return set((state) => ({
            products: state.products.filter((product) => product.id !== id),
          }));
        },

        addMemberToProduct: (memberToProduct) => {
          set((state) => ({
            memberToProducts: state.memberToProducts.filter(
              (mtp) => mtp.memberId !== memberToProduct.memberId
            ),
          }));

          return set((state) => ({
            memberToProducts: [...state.memberToProducts, memberToProduct],
          }));
        },

        removeMemberFromProduct: (memberToProduct) =>
          set((state) => ({
            memberToProducts: state.memberToProducts.filter(
              (mtp) =>
                mtp.memberId !== memberToProduct.memberId ||
                mtp.productId !== memberToProduct.productId
            ),
          })),
      }),
      {
        name: "shopping-store",
        version: 1,
      }
    )
  )
);
