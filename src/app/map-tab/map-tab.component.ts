import { NgStyle } from '@angular/common';
import { Component, AfterViewInit, input, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { Course } from '../get-locs/sched_parser';

const pomereneLat = 39.997558210128304, pomereneLong = -83.01435788813387;

@Component({
	selector: 'app-map-tab',
	imports: [NgStyle],
	templateUrl: './map-tab.component.html',
	styleUrls: ['./map-tab.component.css']
})
export class MapTabComponent implements AfterViewInit {
	private map: L.Map | undefined;
	@ViewChild('mapDiv') mapElementRef: ElementRef | undefined;

	markers: L.Marker[] = [];
	lines: L.Polyline[] = [];

	ngAfterViewInit(): void {
		this.initMap();
	}
	
	/**
	 * Initalizes the map.
	 */
	private initMap(): void {
		this.map = L.map(this.mapElementRef?.nativeElement, {
			center: [pomereneLat, pomereneLong],
			zoom: 14
		});
		// this.map.setMaxBounds(this.map.getBounds());

		const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			minZoom: 14,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		tiles.addTo(this.map);
	}

	/**
	 * Plants courses as waypoints on the map. Clears all previous waypoints.
	 * @param courses The courses to plant as waypoints on the map
	 */
	public plantClasses(courses: Course[]) {
		// clear existing markers from map
		for(let marker of this.markers) { this.map!.removeLayer(marker); }
		this.markers = [];
		for(let line of this.lines) { this.map!.removeLayer(line); }
		this.lines = [];

		// add new markers
		for(let course of courses) {
			let coords = course.coords!;

			let marker = new L.Marker([coords[1], coords[0]])
			marker.bindPopup(`
				${course.department} ${course.number}<br>
				${course.building}<br>
				${course.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} -- ${course.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
			)
			marker.addTo(this.map!);

			this.markers.push(marker);
		}

		// add new lines
		for(let i = 1; i < this.markers.length; i++) {
			let line = L.polyline([this.markers[i-1].getLatLng(), this.markers[i].getLatLng()])
			line.addTo(this.map!);
			this.lines.push(line);
		}
	}
}
