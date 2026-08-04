import { useState } from "react";
import { MapPin, LocateFixed } from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";


function LocationMarker({ setPosition }) {

  useMapEvents({
    click(e) {
      setPosition([
        e.latlng.lat,
        e.latlng.lng
      ]);
    },
  });

  return null;
}


function ChangeView({ position }) {
  const map = useMap();

  map.setView(position, 15);

  return null;
}


export default function MapPicker() {

  const [position, setPosition] = useState([
    30.0444,
    31.2357
  ]);


  const getCurrentLocation = () => {

    navigator.geolocation.getCurrentPosition(
      (location) => {

        const newPosition = [
          location.coords.latitude,
          location.coords.longitude
        ];

        setPosition(newPosition);

      },

      () => {
        alert("لم نتمكن من تحديد موقعك");
      }

    );

  };


  return (

    <div className="rounded-2xl overflow-hidden border bg-white">

      <div className="relative">

        <MapContainer
          center={position}
          zoom={13}
          className="h-[300px] w-full"
        >

          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          <Marker position={position}/>


          <LocationMarker
            setPosition={setPosition}
          />


          <ChangeView position={position}/>


        </MapContainer>


        <button
          onClick={getCurrentLocation}
          className="
          absolute bottom-4 right-4
          bg-white shadow-md
          rounded-full
          px-4 py-2
          flex items-center gap-2
          text-sm
          z-[1000]
          "
        >

          <LocateFixed size={18}/>

          موقعي الحالي

        </button>


      </div>


      <div className="p-4">


        <div className="flex gap-2 items-center">

          <MapPin
            className="text-blue-600"
          />


          <p className="font-semibold">
            اختر موقع الخدمة من الخريطة
          </p>

        </div>


        <p className="text-sm text-gray-500 mt-2">
          {position[0].toFixed(5)} , {position[1].toFixed(5)}
        </p>


      </div>


    </div>

  );
}