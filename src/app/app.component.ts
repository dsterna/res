import { Component, AfterViewInit, inject } from '@angular/core';
import { Station } from './models/models';
import { HeaderComponent } from './header/header.component';
import { NewCardComponent } from './new-card/new-card.component';
import { StationCardComponent } from './station-card/station-card.component';
import { CommonModule } from '@angular/common';
import { SharedService } from './shared.service';

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
export class AppComponent {
  title = 'angular-app';
  public sharedService = inject(SharedService);

  constructor() {}

  trackByStationId(index: number, station: Station): string {
    return station.id;
  }
}
