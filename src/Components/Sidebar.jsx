import React from 'react';
import { useNavigate } from 'react-router';
import { supabase, logActivity } from './SupabaseClient'; 
import toast from 'react-hot-toast';

const Sidebar = ({ activePage, userId }) => { // Accept userId as a prop
    const navigate = useNavigate();

    const handleLogout = async () => {
        // 1. Log the activity using the global function
        if (userId) {
            await logActivity(userId, 'Logout', 'User signed out');
        }

        // 2. Sign out
        await supabase.auth.signOut();
        navigate("/Login");
        toast.error("logged out")
    };
    // Helper to apply "active" styles
    const getLinkStyle = (pageName) => {
        const baseStyle = "block px-4 py-2 rounded-md font-medium transition-colors ";
        return activePage === pageName
            ? baseStyle + "bg-indigo-50 text-indigo-700" // Active style
            : baseStyle + "text-gray-600 hover:bg-gray-50 hover:text-gray-900"; // Inactive style
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0">
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <span className="text-xl font-bold text-indigo-600">MyApp</span>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
                <button 
                    onClick={() => navigate('/Dashboard')} 
                    className={`w-full text-left cursor-pointer ${getLinkStyle('overview')}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => navigate('/Profile')} 
                    className={`w-full text-left cursor-pointer ${getLinkStyle('profile')}`}
                >
                    Profile
                </button>
                <button 
                    onClick={() => navigate('/Settings')} 
                    className={`w-full text-left cursor-pointer ${getLinkStyle('settings')}`}
                >
                    Settings
                </button>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    Log Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;