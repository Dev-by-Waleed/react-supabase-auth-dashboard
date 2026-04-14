import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import Sidebar from './Sidebar';
import { supabase, logActivity } from './SupabaseClient';
import toast from 'react-hot-toast';

const Profile = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        email: '',
        name: '',
        avatar: '',
        userId: '',
        joinedAt: '',
        provider: ''
    });

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data?.session) {
            navigate('/Login');
            toast.error("No active session found, redirecting...")
            return;
        }

        const user = data.session.user;
        const metadata = user.user_metadata;
        const dateOnly = user.created_at.split('T')[0];
        console.log(user.user_metadata)

        setProfileData({
            email: user.email,
            name: metadata.full_name || metadata.name || 'Dashboard User',
            avatar: metadata.avatar_url || null,
            userId: user.id,
            joinedAt: dateOnly,
            provider: user.app_metadata.provider || 'email'
        });

        setLoading(false);

        await logActivity(user.id, 'Profile View', 'User accessed the Profile');
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading Profile...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
            {/* Sidebar Navigation */}
            <Sidebar activePage="profile" userId={profileData.userId} />

            <div className="flex-1 flex flex-col overflow-hidden">

                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8">
                    <h1 className="text-xl font-semibold text-gray-800">My Profile</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 hidden sm:inline-block">
                            {profileData.email}
                        </span>
                        {/* Header Avatarr */}
                        {profileData.avatar ? (
                            <img src={profileData.avatar} alt="Profile" className="h-8 w-8 rounded-full border border-gray-200" />
                        ) : (
                            <div className="h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                {profileData.email.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 sm:p-8">

                    {/* Profile Header Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
                        <div className="h-32 bg-indigo-600"></div>
                        <div className="px-6 sm:px-8 pb-8 flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-16 space-y-4 sm:space-y-0 sm:space-x-6">

                            <div className="relative">
                                {profileData.avatar ? (
                                    <img
                                        src={profileData.avatar}
                                        alt="Profile Avatar"
                                        className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-white shadow-sm object-cover"
                                    />
                                ) : (
                                    <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-indigo-100 text-indigo-600 flex items-center justify-center text-4xl sm:text-5xl font-bold shadow-sm">
                                        {profileData.email.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Name and Email */}
                            <div className="flex-1 pb-2">
                                <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                                <p className="text-gray-500">{profileData.email}</p>
                            </div>

                            <div className="pb-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                                    Active Account
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Account Information Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                            <p className="text-sm text-gray-500 mt-1">Personal details fetched directly from your active session.</p>
                        </div>

                        <div className="px-6 py-4">
                            <dl className="divide-y divide-gray-100">

                                {/* Detail Row */}
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData.name}</dd>
                                </div>

                                {/* Detail Row */}
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData.email}</dd>
                                </div>

                                {/* Detail Row */}
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Login Provider</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                                        {profileData.provider}
                                    </dd>
                                </div>

                                {/* Detail Row */}
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData.joinedAt}</dd>
                                </div>

                                {/* Detail Row */}
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Unique User ID</dt>
                                    <dd className="mt-1 text-sm text-gray-500 font-mono text-xs sm:mt-0 sm:col-span-2 bg-gray-50 p-2 rounded">
                                        {profileData.userId}
                                    </dd>
                                </div>

                            </dl>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Profile;