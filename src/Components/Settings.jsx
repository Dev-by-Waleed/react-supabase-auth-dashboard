import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Sidebar from './Sidebar';
import { supabase, logActivity } from './SupabaseClient';
import toast from 'react-hot-toast';

const Settings = () => {
    const navigate = useNavigate();

    // States for the UI
    const [userEmail, setUserEmail] = useState('loading');
    const [avatarUrl, setAvatarUrl] = useState(null);

    const [userId, setUserId] = useState(null);

    // States for the Password Update feature
    const [newPassword, setNewPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data?.session) {
            toast.error("No active session found, redirecting...")
            navigate('/Login');
            return
        }
        const user = data.session.user;
        setUserEmail(user.email);
        setAvatarUrl(user.user_metadata.avatar_url || null);
        setUserId(data.session.user.id);

        await logActivity(user.id, 'Settings View', 'User accessed the Settings');
    };

    // THE REAL MAGIC: Updating the password in Supabase
    const handleUpdatePassword = async (e) => {
        e.preventDefault(); // Stop the page from refreshing
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        setIsUpdating(true);
        setMessage({ type: '', text: '' });

        // Tell Supabase to update the current user's password
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setNewPassword(''); // Clear the input

            if (userId) {
                logActivity(userId, "Password was changed", "User has changed the password")

            }
        }
        setIsUpdating(false);
    };
    if (userEmail === 'loading') {
        return <div className="flex h-screen items-center justify-center bg-white text-gray-500">Loading Dashboard...</div>;
    }
    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900">

            {/* Sidebar Navigation */}
            <Sidebar activePage="settings" />


            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8">
                    <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 hidden sm:inline-block">
                            {userEmail !== 'loading' ? userEmail : ''}
                        </span>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Profile" className="h-8 w-8 rounded-full border border-gray-200" />
                        ) : (
                            <div className="h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                {userEmail !== 'loading' ? userEmail.charAt(0).toUpperCase() : '?'}
                            </div>
                        )}
                    </div>
                </header>

                {/* Scrollable Main Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 sm:p-8">

                    <div className="max-w-3xl mx-auto space-y-6">

                        {/* Section 1: UI Placeholder for Avatar Upload */}
                        <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900">Profile Picture</h2>
                            <p className="text-sm text-gray-500 mt-1 mb-4">Update your avatar (Requires Supabase Storage setup).</p>

                            <div className="flex items-center space-x-6">
                                {avatarUrl ? (
                                    <img src={avatarUrl} className="h-16 w-16 rounded-full border border-gray-200" alt="Avatar" />
                                ) : (
                                    <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold">
                                        {userEmail !== 'loading' ? userEmail.charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}
                                <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 text-sm font-medium rounded border border-gray-200 cursor-not-allowed">
                                    Upload New Picture (Coming Soon)
                                </button>
                            </div>
                        </div>

                        {/* Section 2: REAL Password Update */}
                        <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900">Security</h2>
                            <p className="text-sm text-gray-500 mt-1 mb-6">Update your password associated with this account.</p>

                            <form onSubmit={handleUpdatePassword} className="max-w-md space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {message.text && (
                                    <div className={`p-3 text-sm rounded ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isUpdating || !newPassword}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {isUpdating ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>

                        {/* Section 3: App Preferences (Visual Only) */}
                        <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900">Preferences</h2>
                            <p className="text-sm text-gray-500 mt-1 mb-4">Manage your app experience.</p>

                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                                    <p className="text-sm text-gray-500">Receive updates about your account activity.</p>
                                </div>
                                {/* A simple mock toggle switch */}
                                <div className="w-11 h-6 bg-indigo-600 rounded-full flex items-center p-1 cursor-pointer">
                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-5"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;