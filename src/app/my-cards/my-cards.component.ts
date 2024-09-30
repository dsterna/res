import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Station } from '../models/models';
import { Router } from '@angular/router';
import { StationCardComponent } from '../station-card/station-card.component';

@Component({
  selector: 'app-my-cards',
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.scss'],
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule, StationCardComponent],
})
export class MyCardsComponent implements OnChanges {
  @Input() stationData!: Station[];
  @Output() removeStationEvent = new EventEmitter<string>();
  @Output() transportTypeChanged = new EventEmitter<{
    id: string;
    transportType: string;
  }>();
  @Output() nameFilterChanged = new EventEmitter<{
    id: string;
    nameFilter: string;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['myStations'];
    if (change) {
      if (change.currentValue.length === 0) {
        this.stationData = [];
      } else {
        this.fetchStationsData(change.currentValue);
      }

      // Update the URL query parameters whenever myStations changes
      this.updateQueryParams();
    }
  }

  fetchStationsData(stations: Station[]) {
    forkJoin(
      stations.map((station) =>
        this.getData(
          this.convertSiteId(station.id),
          station.selectedTransportType
        )
      )
    ).subscribe(
      (data) => {
        this.stationData = data.map((stationData, index) => ({
          originalId: stations[index].id,
          originalName: stations[index].name,
          ...stationData,
          nameFilter: stations[index].nameFilter,
          selectedTransportType: stations[index].selectedTransportType,
        }));
      },
      (error) => console.error('Error loading station data:', error)
    );
  }

  updateQueryParams() {
    const stationsParam = encodeURIComponent(JSON.stringify(this.myStations));
    this.router.navigate([], {
      queryParams: { stations: stationsParam },
      queryParamsHandling: 'merge',
    });
  }

  getData(id: string, transportType?: string) {
    return this.http.get(
      `https://transport.integration.sl.se/v1/sites/${id}/departures?&forecast=300${
        transportType ? '&transport=' + transportType : ''
      }`
    );
  }

  convertSiteId(siteId: string): string {
    return siteId.slice(-4);
  }

  onTransportTypeChange(stationId: string, transportType: string) {
    // Emit the correct object structure
    this.transportTypeChanged.emit({ id: stationId, transportType });
  }

  onNameFilterChanged(event: { id: string; nameFilter: string }) {
    const station = this.myStations.find((s) => s.id === event.id);
    if (station) {
      station.nameFilter = event.nameFilter;
      // Update URL in case the name filter changes
      this.updateQueryParams();
    }
  }
}
