import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Station } from '../models/models';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-station-card',
  standalone: true,
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class StationCardComponent {
  @Input() station!: Station;
  private sharedService = inject(SharedService);

  onRemoveStation() {
    this.sharedService.removeStation(this.station.id); // Emit the station ID for removal
  }

  onTransportTypeChange(event: Event) {
    const transportType = (event.target as HTMLSelectElement).value;
    this.sharedService.onTransportTypeChanged({
      id: this.station.id,
      transportType,
    });
  }

  onNameFilterChange(str: string) {
    this.sharedService.onNameFilterChanged({
      id: this.station.id,
      nameFilter: str,
    });
  }

  getStatusEmoji(status: string): string {
    const statusEmojis: { [key: string]: string } = {
      NOTEXPECTED: '❓',
      NOTCALLED: '⏳',
      EXPECTED: '🔜',
      CANCELLED: '🚫',
      INHIBITED: '🚷',
      ATSTOP: '🚏',
      BOARDING: '🛫',
      BOARDINGCLOSED: '🚪',
      DEPARTED: '✅',
      PASSED: '🕑',
      MISSED: '❌',
      REPLACED: '🔄',
      ASSUMEDDEPARTED: '💨',
    };
    return statusEmojis[status] || '';
  }

  getTransportEmoji(transportMode: string): string {
    switch (transportMode) {
      case 'BUS':
        return '🚌';
      case 'TRAM':
        return '🚊';
      case 'METRO':
        return '🚇';
      case 'TRAIN':
        return '🚆';
      case 'FERRY':
        return '⛴️';
      case 'SHIP':
        return '🛳️';
      case 'TAXI':
        return '🚖';
      default:
        return '';
    }
  }
}
