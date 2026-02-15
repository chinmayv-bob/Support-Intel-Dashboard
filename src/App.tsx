import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/layout/Layout';
import { useUIStore } from './store/useUIStore';
import TicketModal from './components/modals/TicketModal';

// Lazy load views for better performance
// ... existing lazy imports ...
const FocusView = lazy(() => import('./views/FocusView'));
const AnalyticsView = lazy(() => import('./views/AnalyticsView'));
const QualityView = lazy(() => import('./views/QualityView'));
const HandoffView = lazy(() => import('./views/HandoffView'));

const App: React.FC = () => {
  const { viewMode } = useUIStore();

  const renderView = () => {
    switch (viewMode) {
      case 'focus':
        return <FocusView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'quality':
        return <QualityView />;
      case 'handoff':
        return <HandoffView />;
      default:
        return <FocusView />;
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          }>
            {renderView()}
          </Suspense>
        </motion.div>
      </AnimatePresence>
      <TicketModal />
    </Layout>
  );
};

export default App;
