import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
	selector: 'app-map-tab',
	imports: [],
	templateUrl: './map-tab.component.html',
	styleUrls: ['./map-tab.component.css']
})
export class MapTabComponent implements AfterViewInit {
	private map: any;
	
	/**
	 * Initalizes the map.
	 */
	private initMap(): void {
		this.map = L.map('map', {
			center: [39.997558210128304, -83.01435788813387],
			zoom: 15
		});

		const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			minZoom: 15,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		tiles.addTo(this.map);
	}

	constructor() { }

	ngAfterViewInit(): void {
		this.initMap();
	}
}
