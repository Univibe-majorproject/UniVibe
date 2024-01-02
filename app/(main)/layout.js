import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({ children }) => {
  return (
    <div className="h=full">
      <div
        className="hidden md:flex md:flex-row h-[72px] w-full
            z-30 flex-col fixed inset-y-0"
      >
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
