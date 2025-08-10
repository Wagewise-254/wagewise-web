import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
//import type { Database } from '@/lib/database.types';

export default  function OwnerLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="h-screen flex flex-col">
      {/* Topbar */}
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};
