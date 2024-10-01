import { Injectable } from '@angular/core';
import { Station } from './models/models';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public stations: Station[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.init();
  }

  private async init() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      // only run on mount
      if (this.stations.length === 0) {
        for (const id in queryParams) {
          if (queryParams.hasOwnProperty(id)) {
            const stationData = decodeURIComponent(queryParams[id]);
            try {
              const { transportType, nameFilter, name } = JSON.parse(stationData);
              const station: Station = {
                id,
                selectedTransportType: transportType || '',
                nameFilter: nameFilter || '',
                name: name || '',
              };
              this.fetchStationData(station, true);
            } catch (error) {
              console.error('Error parsing station data:', error);
            }
          }
        }
      }
    });
  }

  addStation(station: Station) {
    if (!this.stations.some((s) => s.id === station.id)) {
      this.fetchStationData(station, true);
    }
  }

  removeStation(stationId: string) {
    this.stations = this.stations.filter((station) => station.id !== stationId);
    this.updateQueryParams();
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
    if (station) {
      station.nameFilter = event.nameFilter.toLowerCase();
      this.updateQueryParams(); // Update query params when input changes
      this.applyNameFilter(station); // Apply the filtering on input
    }
  }

  // This function runs the actual filtering logic
  private applyNameFilter(station: Station) {
    if (station && station.originalDepartures) {
      const nameFilterLower = station.nameFilter;
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

  // Fetches station data and updates the local stations array
  private async fetchStationData(station: Station, isNew: boolean) {
    try {
      const stationData: any = await lastValueFrom(
        this.getData(this.convertSiteId(station.id), station.selectedTransportType)
      );
      const newStation = {
        ...station,
        stationData,
        originalDepartures: stationData.departures,
      };

      if (isNew) {
        this.stations.unshift(newStation);
      } else {
        this.stations = this.stations.map((s) =>
          s.id === station.id ? newStation : s
        );
      }

      // Apply name filter after fetching the data
      this.applyNameFilter(newStation);
      this.updateQueryParams(); 
    } catch (error) {
      console.error('Error fetching station data:', error);
    }
  }

  private getData(id: string, transportType?: string) {
    return this.http.get(
      `https://transport.integration.sl.se/v1/sites/${id}/departures?forecast=300${
        transportType ? '&transport=' + transportType : ''
      }`
    );
  }

  private convertSiteId(siteId: string): string {
    return siteId.slice(-4);
  }

  private updateQueryParams() {
    const params: { [key: string]: string } = {};
    this.stations.forEach((station) => {
      params[station.id] = JSON.stringify({
        transportType: station.selectedTransportType,
        nameFilter: station.nameFilter,
        name: station.name || '',
      });
    });

    if (Object.keys(params).length === 0) {
      this.router.navigate([], { queryParams: {} });
    } else {
      this.router.navigate([], {
        queryParams: params,
        queryParamsHandling: 'merge',
      });
    }
  }
}
