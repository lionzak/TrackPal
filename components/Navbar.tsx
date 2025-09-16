import { Calendar, DollarSign, Home, Target } from "lucide-react";

const Navbar: React.FC<{
    activeSection: string;
    setActiveSection: (section: string) => void;
    isMobile?: boolean;
}> = ({ activeSection, setActiveSection, isMobile = false }) => {
    const sections = [
        { label: "Dashboard", icon: Home },
        { label: "Routine", icon: Calendar },
        { label: "Goals", icon: Target },
        { label: "Finance", icon: DollarSign }
    ];

    if (isMobile) {
        return (
            <div className="space-y-1 ">
                {sections.map((section) => (
                    <button
                        key={section.label}
                        className={` hover:cursor-pointer  w-full text-left px-3 py-3 rounded-md flex items-center space-x-3  ${
                            activeSection === section.label 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveSection(section.label)}
                    >
                        <section.icon size={20} />
                        <span className="font-medium">{section.label}</span>
                    </button>
                ))}
            </div>
        );
    }

    return (
        <nav>
            <ul className="flex space-x-1 lg:space-x-4">
                {sections.map((section) => (
                    <li key={section.label}>
                        <button
                            className={`hover:cursor-pointer flex items-center space-x-2 px-3 py-2 rounded-md text-sm lg:text-base font-medium transition-colors ${
                                activeSection === section.label 
                                    ? 'text-blue-600 bg-blue-50' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveSection(section.label)}
                        >
                            <section.icon size={18} className="lg:w-5 lg:h-5" />
                            <span className="hidden sm:inline">{section.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;