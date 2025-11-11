import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
  catchError,
} from 'rxjs/operators';
import { CommonModule } from '@angular/common';
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
  corsError: boolean = false; // Error flag

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((term) => term.trim().length > 0),
        switchMap((term) => this.searchEntries(term))
      )
      .subscribe({
        next: (results: any) => {
          this.results = results.locations
            .sort((a: any, b: any) => b.matchQuality - a.matchQuality)
            .slice(0, 5);
        },
      });
  }

  onSearch(event: any): void {
    const term = event.target.value.trim();
    this.results = term.length > 0 ? this.results : [];
    this.searchTerms.next(term);
  }

  searchEntries(term: string) {
    return (
      this.http
        .get<any>(
          `https://journeyplanner.integration.sl.se/v2/stop-finder?name_sf=${term}&any_obj_filter_sf=2&type_sf=any&gen_c=false`
          // `https://journeyplanner.integration.sl.se/v1/typeahead.json?searchstring=${term}&stationsonly=true&maxresults=5&key=${environment.apiKey}`
        )
        // https://journeyplanner.integration.sl.se/v2/stop-finder?name_sf=odenplan&any_obj_filter_sf=2&type_sf=any
        .pipe(
          catchError((error) => {
            console.log('arg');
            this.corsError = true;
            return of({ locations: [] }); // Return a consistent shape
          })
        )
    );
  }

  onAddStation(siteId: string, name: string) {
    console.log('siteId', siteId);
    this.service.addStation({
      id: siteId,
      name,
      selectedTransportType: '',
      nameFilter: '',
    });
  }
}
