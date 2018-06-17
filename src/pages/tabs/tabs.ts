import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { StatsPage } from '../stats/stats';
import { AboutPage } from '../about/about';

@IonicPage()
@Component({
	selector: 'page-tabs',
	templateUrl: 'tabs.html'
})
export class TabsPage {

	homeRoot = HomePage;
	statsRoot = StatsPage;
	aboutRoot = AboutPage;

	constructor(
		public navCtrl: NavController
	) {

	}
}
