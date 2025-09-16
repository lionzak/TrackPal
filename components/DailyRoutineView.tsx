import { BarChart3 } from "lucide-react";

const DailyRoutineView: React.FC = () => {
    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Daily Routine 📅</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add Routine
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    <div className="text-center text-gray-500 py-8">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No routines yet</h3>
                        <p className="text-gray-500 mb-4">Get started by creating your first daily routine.</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Create Routine
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyRoutineView;