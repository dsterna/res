export interface Station {
  id: string;
  name: string;
  nameFilter: string; // Optional property for filtering
  selectedTransportType: string; // Optional property for selected transport type
  originalName?: string;
  stationData?: any;
  originalDepartures?: any;
}
