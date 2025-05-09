import { Component, AfterViewInit, input, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

const pomereneLat = 39.997558210128304, pomereneLong = -83.01435788813387;

@Component({
	selector: 'app-map-tab',
	imports: [],
	templateUrl: './map-tab.component.html',
	styleUrls: ['./map-tab.component.css']
})
export class MapTabComponent implements AfterViewInit {
	private map: L.Map | undefined;
	@ViewChild('mapDiv') mapElementRef: ElementRef | undefined;
	
	ngAfterViewInit(): void {
		this.initMap();
	}
	
	/**
	 * Initalizes the map.
	 */
	private initMap(): void {
		this.map = L.map(this.mapElementRef?.nativeElement, {
			center: [pomereneLat, pomereneLong],
			zoom: 15
		});
		this.map.setMaxBounds(this.map.getBounds());

		const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			minZoom: 15,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		tiles.addTo(this.map);
	}

}
