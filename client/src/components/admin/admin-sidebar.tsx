import { Edit, FileText, AlertCircle, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "write", label: "Write Article", icon: Edit },
  { id: "articles", label: "All Articles", icon: FileText },
  { id: "breaking", label: "Breaking News", icon: AlertCircle },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <div className="w-64 bg-slate-800 text-white flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start space-x-3 ${
                  activeTab === item.id
                    ? "bg-primary text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
