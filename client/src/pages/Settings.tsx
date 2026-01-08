import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Settings as SettingsIcon, User, Shield, Bell, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center gap-3 border-b pb-6">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Manage your personal details and account preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">First Name</p>
                    <p className="font-medium">{user?.firstName || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                    <p className="font-medium">{user?.lastName || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                  <p className="font-medium">{user?.email || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>Privacy settings and authentication management.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Privacy</p>
                    <p className="text-sm text-muted-foreground">Your educational data is protected and syllabus-aligned.</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-destructive">Danger Zone</p>
                    <p className="text-sm text-muted-foreground">Permanently sign out of your account.</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Stay updated with new features and content updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">Notification preferences coming soon.</p>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </main>
    </div>
  );
}
