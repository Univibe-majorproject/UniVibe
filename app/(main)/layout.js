import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({ children }) => {
  return (
    <div className="h-full">
      {/* <div
        className="flex flex-row h-[72px] w-fit
            z-30 fixed inset-y-0"
      >
        <NavigationSidebar />
      </div> */}
      <main className="h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
