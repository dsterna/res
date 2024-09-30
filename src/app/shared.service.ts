import { Injectable } from '@angular/core';
import { Station } from './models/models';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public stations: Station[] = [];

  constructor(private http: HttpClient) {}

  addStation(station: Station) {
    if (!this.stations.some((s) => s.id === station.id)) {
      this.fetchStationData(station, true);
    }
  }

  removeStation(stationId: string) {
    this.stations = this.stations.filter((station) => station.id !== stationId);
  }

  onTransportTypeChanged(event: { id: string; transportType: string }) {
    const station = this.stations.find((s) => s.id === event.id);
    if (station) {
      station.selectedTransportType = event.transportType;
      this.fetchStationData(station, false);
    }
  }
  onNameFilterChanged(event: { id: string; nameFilter: string }) {
    const station = this.stations.find((s) => s.id === event.id);
    if (station && station.originalDepartures) {
      const nameFilterLower = event.nameFilter.toLowerCase();

      const filteredDepartures = station.originalDepartures.filter(
        (departure: any) =>
          departure.destination.toLowerCase().includes(nameFilterLower)
      );

      this.stations = this.stations.map((s) =>
        s.id === station.id
          ? {
              ...s,
              stationData: {
                ...station.stationData,
                departures: filteredDepartures,
              },
            }
          : s
      );
    }
  }
  private async fetchStationData(station: Station, isNew: boolean) {
    try {
      const stationData: any = await lastValueFrom(
        this.getData(
          this.convertSiteId(station.id),
          station.selectedTransportType
        )
      );

      const newStation = {
        ...station,
        stationData,
        originalDepartures: stationData.departures,
      };

      if (isNew) {
        this.stations.push(newStation);
      } else {
        this.stations = [
          ...this.stations.map((s) => (s.id === station.id ? newStation : s)),
        ];
      }

      // this.updateQueryParams();
    } catch (error) {
      console.error('Error fetching station data:', error);
    }
  }
  getData(id: string, transportType?: string) {
    return this.http.get(
      `https://transport.integration.sl.se/v1/sites/${id}/departures?forecast=300${
        transportType ? '&transport=' + transportType : ''
      }`
    );
  }

  convertSiteId(siteId: string): string {
    return siteId.slice(-4);
  }
}
