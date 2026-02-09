import Sidebar from './Sidebar';
import Header from './Header';

function MainLayout({ children, pageTitle, onSearch, fullWidth = false }) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-black">
        <Header pageTitle={pageTitle} onSearch={onSearch} />
        
        <div className={`flex-1 overflow-auto ${fullWidth ? '' : 'p-8'}`}>
          <div className={fullWidth ? 'h-full w-full' : 'max-w-7xl mx-auto'}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
