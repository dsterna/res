import {
  AppComponent,
  LOCALE_ID,
  bootstrapApplication,
  provideHttpClient,
  provideRouter,
  registerLocaleData,
  withComponentInputBinding
} from "./chunk-7KWEX5BE.js";

// node_modules/@angular/common/locales/sv.mjs
var u = void 0;
function plural(val) {
  const n = val, i = Math.floor(Math.abs(val)), v = val.toString().replace(/^[^.]*\.?/, "").length;
  if (i === 1 && v === 0) return 1;
  return 5;
}
var sv_default = ["sv", [["fm", "em"], u, u], [["fm", "em"], ["f.m.", "e.m."], ["f\xF6rmiddag", "eftermiddag"]], [["S", "M", "T", "O", "T", "F", "L"], ["s\xF6n", "m\xE5n", "tis", "ons", "tors", "fre", "l\xF6r"], ["s\xF6ndag", "m\xE5ndag", "tisdag", "onsdag", "torsdag", "fredag", "l\xF6rdag"], ["s\xF6", "m\xE5", "ti", "on", "to", "fr", "l\xF6"]], u, [["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["jan.", "feb.", "mars", "apr.", "maj", "juni", "juli", "aug.", "sep.", "okt.", "nov.", "dec."], ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"]], u, [["f.Kr.", "e.Kr."], u, ["f\xF6re Kristus", "efter Kristus"]], 1, [6, 0], ["y-MM-dd", "d MMM y", "d MMMM y", "EEEE d MMMM y"], ["HH:mm", "HH:mm:ss", "HH:mm:ss z", "HH:mm:ss zzzz"], ["{1} {0}", u, u, u], [",", "\xA0", ";", "%", "+", "\u2212", "\xD710^", "\xD7", "\u2030", "\u221E", "NaN", ":"], ["#,##0.###", "#,##0\xA0%", "#,##0.00\xA0\xA4", "#E0"], "SEK", "kr", "svensk krona", {
  "AUD": [u, "$"],
  "BBD": ["Bds$", "$"],
  "BMD": ["BM$", "$"],
  "BRL": ["BR$", "R$"],
  "BSD": ["BS$", "$"],
  "BYN": [u, "\u0440."],
  "BZD": ["BZ$", "$"],
  "CNY": [u, "\xA5"],
  "DKK": ["Dkr", "kr"],
  "DOP": ["RD$", "$"],
  "EEK": ["Ekr"],
  "EGP": ["EG\xA3", "E\xA3"],
  "ESP": [],
  "GBP": [u, "\xA3"],
  "HKD": [u, "$"],
  "IEP": ["IE\xA3"],
  "INR": [u, "\u20B9"],
  "ISK": ["Ikr", "kr"],
  "JMD": ["JM$", "$"],
  "JPY": [u, "\xA5"],
  "KRW": [u, "\u20A9"],
  "NOK": ["Nkr", "kr"],
  "NZD": [u, "$"],
  "PHP": [u, "\u20B1"],
  "RON": [u, "L"],
  "SEK": ["kr"],
  "TWD": [u, "NT$"],
  "USD": ["US$", "$"],
  "VND": [u, "\u20AB"]
}, "ltr", plural];

// src/main.ts
registerLocaleData(sv_default);
var routes = [
  {
    path: "",
    loadComponent: () => import("./chunk-3B54ANYJ.js").then((m) => m.AppComponent)
    // Lazy load AppComponent
  }
  // Define more routes for other components as needed
];
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: "sv" }
  ]
}).catch((err) => console.error("Error bootstrapping application:", err));
/*! Bundled license information:

@angular/common/locales/sv.mjs:
  (**
   * @license
   * Copyright Google LLC All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   *)
*/
//# sourceMappingURL=main.js.map
