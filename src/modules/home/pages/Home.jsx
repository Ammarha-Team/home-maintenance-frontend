import React from 'react';
import UserNavbar from "../../../shared/components/HomeNavbar";
import LocationHeader from '../components/LocationHeader';
import QuickActions from '../components/QuickActions';
// import SearchBar from '../components/SearchBar';
// import ServiceCategories from '../components/ServiceCategories';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-6 py-6 flex-1 w-full space-y-6">
        <LocationHeader />
        <QuickActions />
        {/* <SearchBar /> */}
        {/* <ServiceCategories /> */}
      </main>
    </div>
  );
}