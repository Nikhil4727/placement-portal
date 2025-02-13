import PerformanceCard from "./PerformanceCard";
import QuestionCard from "./QuestionCard";

const TrainingPage=() => {
  return (
    <>
     <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Training Dashboard</h1>
        <div className="grid grid-cols-2 gap-8">
        <ErrorBoundary>
            <PerformanceCard />
          </ErrorBoundary>
          <ErrorBoundary>
            <QuestionCard />
          </ErrorBoundary>
        </div>
      </div>
      
    </div>
    </>
   
  );
};
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Component crashed:", error);
    return <p className="text-red-500">Component failed to load.</p>;
  }
};

export default TrainingPage;
