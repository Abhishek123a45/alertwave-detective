import { HomeIcon, Clock } from "lucide-react";
import Index from "./pages/Index.jsx";
import AlarmClock from "./components/AlarmClock.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Alarm Clock",
    to: "/alarm",
    icon: <Clock className="h-4 w-4" />,
    page: <AlarmClock />,
  },
];