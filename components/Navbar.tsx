  // components/Navbar.tsx
  import { Calendar, DollarSign, Home, Target } from 'lucide-react';
  import React from 'react';

  interface NavbarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
  }

  const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
    const sections = [{label: "Dashboard", icon: Home}, {label: "Routine", icon:Calendar}, {label: "Goals", icon:Target}, {label: "Finance", icon:DollarSign}];

    return (
      <nav className="">
        <ul className="flex space-x-4">
          {sections.map((section) => (
            <li key={section.label}>
              <button
                className={`text-black px-3 py-2 rounded-md ${
                  activeSection === section.label ? 'text-blue-600' : 'hover:bg-gray-200'
                } hover:cursor-pointer`}
                onClick={() => setActiveSection(section.label)}
              >
                  <section.icon className="inline-block mr-2" size={20} />
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  export default Navbar;