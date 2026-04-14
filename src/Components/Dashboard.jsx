import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import Sidebar from './Sidebar';
import { supabase, logActivity } from './SupabaseClient';
import toast from 'react-hot-toast';

// Create a single supabase client for interacting with your database

const Dashboard = () => {
    const navigate = useNavigate();


    // Existing States
    const [userEmail, setUserEmail] = useState('loading');
    const [verified, setVerified] = useState("Loading");
    const [name, setName] = useState("")
    const [lastLogin, setLastLogin] = useState("loading");
    const [activeSessions, setActiveSessions] = useState(0);

    const [userId, setUserId] = useState(null);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        userData();
    }, []);

    const userData = async () => {
        const { data, error } = await supabase.auth.getSession();

        // THE FIX: Check if there's an error OR if the session is missing/null
        if (error || !data?.session) {
            toast.error("No active session found, redirecting...")
            navigate('/Login');
            return; // Stop running the rest of the function
        }

        // If we make it here, we 100% have a logged-in user!
        // 1. Extract the user object
        const user = data.session.user;
        const { email, email_verified } = user.user_metadata;
        const dateOnly = user.last_sign_in_at.split('T')[0];

        // 2. Set UI States
        setUserEmail(email);
        setVerified(email_verified ? "Verified" : "Unverified");
        setLastLogin(dateOnly);
        setActiveSessions(1);
        setUserId(user.id);
        setName(user.user_metadata.name)

        // 3. Log that the user viewed the dashboard right now
        await logActivity(user.id, 'Dashboard View', 'User accessed the main dashboard');

        // 4. Fetch the most recent 5 activities to display on the screen
        const { data: history, error: fetchError } = await supabase
            .from('activities')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

        if (!fetchError && history) {
            setActivities(history);
        }
    };


    if (userEmail === 'loading') {
        return <div className="flex h-screen items-center justify-center bg-white text-gray-500">Loading Dashboard...</div>;
    }
    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
            {/* Sidebar Navigation */}
            <Sidebar activePage="overview" userId={userId} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8">
                    <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 hidden sm:inline-block">
                            {userEmail}
                        </span>
                        <div className="h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                            {userEmail !== 'loading' ? userEmail.charAt(0).toUpperCase() : '?'}
                        </div>
                    </div>
                </header>

                {/* Scrollable Main Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 sm:p-8">
                    {/* Welcome Banner */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Welcome back {name}!</h2>
                        <p className="text-gray-600 mt-1">Here is what's happening with your account today.</p>
                    </div>

                    {/* KPI Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Card 1 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-medium text-gray-500">Active Sessions</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{activeSessions}</p>
                            <p className="text-sm text-green-600 mt-2">Currently logged in</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{verified}</p>
                            <p className="text-sm text-gray-500 mt-2">Supabase Auth Active</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{lastLogin}</p>
                            <p className="text-sm text-gray-500 mt-2">Via Email/Password</p>
                        </div>
                    </div>

                    {/* Content Section: Recent Activity */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                        </div>

                        {/* NEW: Dynamic Activity List */}
                        <div className="p-6">
                            {activities.length > 0 ? (
                                <ul className="space-y-4">
                                    {activities.map((item) => (
                                        <li key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{item.action_type}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {/* Convert the database timestamp to a readable local time */}
                                                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center text-gray-500 py-4">
                                    <p>No recent activity yet.</p>
                                    <p className="text-sm mt-2">Interact with the app to see logs appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;