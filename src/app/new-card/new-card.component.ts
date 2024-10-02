import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
} from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Station } from '../models/models';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-new-card',
  standalone: true,
  templateUrl: './new-card.component.html',
  imports: [CommonModule],
  styleUrls: ['./new-card.component.scss'],
})
export class NewCardComponent implements OnInit {
  private searchTerms = new Subject<string>();
  results: any[] = [];
  private service = inject(SharedService);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((term) => term.trim().length > 0),
        switchMap((term) => this.searchEntries(term))
      )
      .subscribe((results: any) => (this.results = results.ResponseData));
  }

  onSearch(event: any): void {
    const term = event.target.value.trim();
    this.results = term.length > 0 ? this.results : [];
    this.searchTerms.next(term);
  }

  searchEntries(term: string) {
    return this.http.get<any[]>(
      // free key, use it as you please ;)
      `/api/v1/typeahead.json?searchstring=${term}&stationsonly=true&maxresults=5&key=1e350bd8eb674967ae35564c14c2edf6`
    );
  }

  onAddStation(siteId: string, name: string) {
    this.service.addStation({
      id: siteId,
      name,
      selectedTransportType: '',
      nameFilter: '',
    });
  }
}
