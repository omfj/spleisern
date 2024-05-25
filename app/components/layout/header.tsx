import { UserButton } from "@clerk/remix";

export const Header = () => {
  return (
    <div className="mb-8 px-4">
      <header className="max-w-screen-xl mx-auto py-4 flex items-center justify-between">
        <div>
          <a href="/hjem">
            <h1 className="font-medium text-xl">{"Spleiser'n"}</h1>
          </a>
        </div>

        <div>
          <nav>
            <ul className="flex items-center gap-2">
              <li>
                <UserButton />
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};
