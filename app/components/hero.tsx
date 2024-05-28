import { ButtonLink } from "./ui/buttons";

export const Hero = () => {
  return (
    <div className="py-8 flex flex-col gap-4 text-center">
      <h1 className="text-5xl font-bold">{"Spleiser'n"}</h1>
      <p className="text-gray-700 text-lg font-medium">
        Opprett en spleis og inviter venner til å bidra.
      </p>

      <ButtonLink className="mx-auto" to="/opprett">
        Opprett spleis
      </ButtonLink>
    </div>
  );
};
