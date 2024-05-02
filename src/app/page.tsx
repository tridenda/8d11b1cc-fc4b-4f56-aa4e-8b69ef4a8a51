import UsersTable from "@/components/users-table.component";
import { UsersContextProvider } from "@/services/users/users.context";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-5">
      <UsersContextProvider>
        <UsersTable />
      </UsersContextProvider>
    </main>
  );
}
