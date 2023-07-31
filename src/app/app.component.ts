import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import * as AOS from 'aos';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database'
import { environment } from '../environments/environment';
import { filter } from 'rxjs/operators';

declare const gtag: Function; // <------------Important: the declartion for gtag is required!

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
})

export class AppComponent implements OnInit {
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    AOS.init();
    firebase.initializeApp(environment.config);
    /** START : Code to Track Page View using gtag.js */
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      gtag('event', 'page_view', {
        page_path: event.urlAfterRedirects
      })
    })
    /** END : Code to Track Page View using gtag.js */
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
