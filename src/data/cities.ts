export interface City {
  name: string;
  lat: number;
  lng: number;
}

export const INDIA_CITIES: City[] = [
  // Major Cities
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Ghaziabad",lat: 28.6692,lng: 77.4538,},
  { name: "Kanpur",lat: 26.4499,lng: 80.3319,},
  { name: "Patna",lat: 25.5941,lng: 85.1376,},
  { name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },

  // Extreme North
  { name: "Leh", lat: 34.1526, lng: 77.5770 },
  { name: "Srinagar", lat: 34.0837, lng: 74.7973 },
  { name: "Shimla", lat: 31.1048, lng: 77.1734 },

  // Extreme North-East
  { name: "Itanagar", lat: 27.0844, lng: 93.6053 },
  { name: "Gangtok", lat: 27.3389, lng: 88.6065 },

  // Extreme South
  { name: "Kanyakumari", lat: 8.0883, lng: 77.5385 },
  { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },

  // Island Extreme
  { name: "Port Blair", lat: 11.6234, lng: 92.7265 },
];