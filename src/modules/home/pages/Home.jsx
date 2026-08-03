import React from 'react';
import HomeNavbar from '../../../shared/components/HomeNavbar';
// import LocationHeader from '../components/LocationHeader';
// import SearchBar from '../components/SearchBar';
// import QuickActions from '../components/QuickActions';
// import ServiceCategories from '../components/ServiceCategories';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <HomeNavbar />

      {/* <main className="max-w-7xl mx-auto px-6 py-6 flex-1 w-full space-y-6">
        
        <LocationHeader />

        <SearchBar />

        <QuickActions />

        <ServiceCategories />

      </main> */}

    </div>
  );
}