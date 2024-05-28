import { X } from "lucide-react";
import { nanoid } from "nanoid";
import { useState, useRef } from "react";

import { Button } from "~/components/ui/buttons";
import { Input } from "~/components/ui/input";
import { useSettlementStore } from "~/stores/settlement";

export const AddMembersStep = () => {
  const { members, addMember, removeMember } = useSettlementStore();
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddMember = () => {
    if (!name) return;

    addMember({
      id: nanoid(),
      name,
    });

    setName("");
    inputRef.current?.focus();
  };

  return (
    <div>
      <h2 className="text-gray-700 text-2xl mb-4">Legg til medlemmer</h2>

      <div className="mb-8">
        {members.length === 0 ? (
          <p className="text-gray-600 text-center text-xl font-medium">
            Ingen medlemmer lagt til
          </p>
        ) : (
          <div className="divide-y">
            {members.map((member) => (
              <div key={member.id} className="py-2 flex items-center">
                <p className="text-gray-600 font-medium flex-1">
                  {member.name}
                </p>
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={name}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddMember();
            }
          }}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
          placeholder="Navn..."
        />
        <Button onClick={handleAddMember} className="ml-4">
          Legg til
        </Button>
      </div>
    </div>
  );
};
