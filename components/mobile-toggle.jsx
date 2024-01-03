import { Menu } from "lucide-react";

import { 
    Sheet, 
    SheetContent, 
    SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";

export const MobileToggle = ({
    serverId,
}) => {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu/>
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-1 flex gap-0 w-64">
            {/* <div className="w-[72px]">
                <NavigationSidebar />   
            </div> */}
            <ServerSidebar serverId={serverId}/>
        </SheetContent>
    </Sheet>
  )
};
