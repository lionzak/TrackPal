import { BarChart3 } from "lucide-react";

interface AppProps {
  displayName: string;
}

const DashboardView: React.FC<AppProps> = ({ displayName }) => {
    return (
        <div className="space-y-4 sm:space-y-6">

            <div className=" text-white  bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl sm:text-3xl font-semibold">
                    Welcome back, {displayName.split(" ")[0]}!
                </h1>
                <p className="text-sm sm:text-base ">
                    Ready to crush today&apos;s goals?
                </p>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-gray-500 truncate">
                                Total Tasks
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">
                                24
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-gray-500 truncate">
                                Completed
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">
                                18
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-gray-500 truncate">
                                In Progress
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">
                                6
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-gray-500 truncate">
                                Goals Met
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">
                                12
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            <div className="text-sm text-gray-600 flex-1">Completed morning routine</div>
                            <div className="text-xs text-gray-400 flex-shrink-0">2h ago</div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                            <div className="text-sm text-gray-600 flex-1">Updated weekly budget</div>
                            <div className="text-xs text-gray-400 flex-shrink-0">4h ago</div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0"></div>
                            <div className="text-sm text-gray-600 flex-1">Set new fitness goal</div>
                            <div className="text-xs text-gray-400 flex-shrink-0">1d ago</div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                            Add Task
                        </button>
                        <button className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                            Log Expense
                        </button>
                        <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                            Set Goal
                        </button>
                        <button className="bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                            View Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;