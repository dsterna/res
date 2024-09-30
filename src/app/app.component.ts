import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { Station } from './models/models';
import { HeaderComponent } from './header/header.component';
import { NewCardComponent } from './new-card/new-card.component';
import { StationCardComponent } from './station-card/station-card.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    HeaderComponent,
    NewCardComponent,
    StationCardComponent,
    CommonModule,
  ],
})
export class AppComponent implements AfterViewInit {
  title = 'angular-app';
  public myStations: Station[] = [];
  private isInit = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['stations'] && this.myStations.length === 0) {
        const decodedStations = decodeURIComponent(params['stations']);
        this.myStations = JSON.parse(decodedStations);
        this.myStations.forEach((elem) => {
          this.fetchStationData(elem, false);
        });
      }
    });
  }

  removeStation(stationId: string) {
    this.myStations = this.myStations.filter(
      (station) => station.id !== stationId
    );
    this.updateQueryParams();
  }

  addStation(station: Station) {
    if (!this.myStations.some((s) => s.id === station.id)) {
      this.fetchStationData(station, true);
    }
  }

  onTransportTypeChanged(event: { id: string; transportType: string }) {
    const station = this.myStations.find((s) => s.id === event.id);
    if (station) {
      station.selectedTransportType = event.transportType;
      this.fetchStationData(station, false);
    }
  }

  onNameFilterChanged(event: { id: string; nameFilter: string }) {
    const station = this.myStations.find((s) => s.id === event.id);
    if (station && station.originalDepartures) {
      this.myStations = this.myStations.map((s) =>
        s.id === station.id
          ? {
              ...s,
              stationData: {
                ...station.stationData,
                departures: station.originalDepartures.filter(
                  (departure: any) =>
                    departure.destination
                      .toLowerCase()
                      .includes(event.nameFilter.toLowerCase())
                ),
              },
            }
          : s
      );
    }
    this.updateQueryParams(); // Update URL parameters whenever the name filter changes
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
        this.myStations.push(newStation);
      } else {
        this.myStations = this.myStations.map((s) =>
          s.id === station.id ? newStation : s
        );
      }

      this.updateQueryParams();
    } catch (error) {
      console.error('Error fetching station data:', error);
    }
  }

  private updateQueryParams() {
    let params;
    if (this.myStations.length === 0) {
      params = {};
    } else {
      params = {
        stations: JSON.stringify(
          this.myStations.map(
            ({ id, name, nameFilter, selectedTransportType }) => ({
              id,
              name,
              nameFilter,
              selectedTransportType,
              stationData: { departures: [] },
              originalDepartures: [],
            })
          )
        ),
      };
    }
    this.router.navigate([], { queryParams: params });
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

  trackByStationId(index: number, station: Station): string {
    return station.id;
  }
}
