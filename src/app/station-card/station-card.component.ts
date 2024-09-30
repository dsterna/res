import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Station } from '../models/models';

@Component({
  selector: 'app-station-card',
  standalone: true,
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class StationCardComponent {
  @Input() station!: Station;
  @Output() removeStationEvent = new EventEmitter<string>();
  @Output() transportTypeChanged = new EventEmitter<{
    id: string;
    transportType: string;
  }>();
  @Output() nameFilterChanged = new EventEmitter<{
    id: string;
    nameFilter: string;
  }>();

  onRemoveStation() {
    this.removeStationEvent.emit(this.station.id); // Emit the station ID for removal
  }

  onTransportTypeChange(event: Event) {
    const transportType = (event.target as HTMLSelectElement).value;
    this.transportTypeChanged.emit({ id: this.station.id, transportType }); // Emit the station ID with transport type
  }

  onNameFilterChange(str: string) {
    this.nameFilterChanged.emit({ id: this.station.id, nameFilter: str }); // Emit the station ID with name filter
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
