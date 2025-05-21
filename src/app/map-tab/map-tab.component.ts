import { NgStyle } from '@angular/common';
import { Component, AfterViewInit, input, ViewChild, ElementRef, Input, Attribute } from '@angular/core';
import * as L from 'leaflet';
import { Course } from '../get-locs/sched_parser';

const OMS = (<any>window).OverlappingMarkerSpiderfier;
import 'overlapping-marker-spiderfier-leaflet';

const pomereneLat = 39.997558210128304, pomereneLong = -83.01435788813387;

@Component({
	selector: 'app-map-tab',
	imports: [],
	templateUrl: './map-tab.component.html',
	styleUrls: ['./map-tab.component.css']
})
export class MapTabComponent implements AfterViewInit {
	private map: L.Map | undefined;
	markers: L.Marker[] = [];
	lines: L.Polyline[] = [];
	oms: any;

	@ViewChild('mapDiv') mapElementRef: ElementRef | undefined;

	public day: string;
	constructor(@Attribute("day") day: string) {
		this.day = day;
	}

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
		this.oms = new OMS(this.map);
		console.log(this.oms);
	}

	/**
	 * Plants courses as waypoints on the map. Clears all previous waypoints.
	 * 
	 * @param courses The courses to plant as waypoints on the map
	 */
	public plantClasses(courses: Course[]) {
		// clear existing markers from map
		for(let marker of this.markers) { this.map!.removeLayer(marker); this.oms.removeMarker(marker); }
		this.markers = [];
		for(let line of this.lines) { this.map!.removeLayer(line); }
		this.lines = [];

		// add new markers and tooltips
		courses.forEach((course, number) => {
			this.createMarker(course, number, courses.length - number);
		})

		// add new lines
		for(let i = 1; i < this.markers.length; i++) {
			let line = L.polyline([this.markers[i-1].getLatLng(), this.markers[i].getLatLng()]);
			line.addTo(this.map!);
			this.lines.push(line);
		}

		this.uncollideTooltips();
	}

	/**
	 * Creates a marker for a course and adds it to the map.
	 * 
	 * @param course The course to plot
	 * @param number The index of the course in the larger list of courses
	 * @param total The total amount of courses in the larger list
	 * @returns A reference to the marker created
	 */
	private createMarker(course: Course, number: number, total: number): L.Marker {
		let coords = course.coords!;

		// add marker
		let marker = new L.Marker([coords[1], coords[0]], { zIndexOffset: total - number });
		
		// create class marker with description popup
		marker.bindPopup(`
			${course.department} ${course.number}<br>
			${course.building}<br>
			${course.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} -- ${course.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
		)
		marker.addTo(this.map!);

		// create tooltip for showing order of classes
		marker.bindTooltip(`${number+1}`, { 
			permanent: true, 
			opacity: 1
		})

		marker.getTooltip()

		// add marker to map and store
		this.oms.addMarker(marker);
		this.markers.push(marker);

		return marker;
	}

	/**
	 * Helper method for "uncolliding" tooltips. Doesn't actually do it; instead, it adds the labels of the colliding tooltips to the very top tooltip, so that the top tooltip says what is below it.
	 */
	private uncollideTooltips() {
		for(let i = this.markers.length - 1; i >= 0; i--) {
			for(let j = i - 1; j >= 0; j--)  {
				let markerI = this.markers[i], markerJ = this.markers[j];
				if(markerI.getLatLng().equals(markerJ.getLatLng())) {
					let markerIOffset = markerI.getTooltip()!.options["offset"]!;
					let newOffset = L.point(25, 0).add(markerIOffset);
					markerI.bindTooltip(markerI.getTooltip()!, { offset: newOffset });
				}
			}
		}
	}
}
