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

	ngAfterViewInit(): void { this.initMap(); }
	
	/**
	 * Initalizes the map.
	 */
	private initMap(): void {
		this.map = L.map(this.mapElementRef?.nativeElement, {
			center: [pomereneLat, pomereneLong],
			zoom: 14
		});
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

		// add new markers, tooltips, and routes
		courses.forEach((course, number) => 
			this.markers.push(this.createMarker(course, number, courses.length))
		)
		this.drawRoute();

		this.uncollideTooltips(); // do initial uncollision

		this.oms.addListener('spiderfy', (markers: L.Marker[]) => { // add listener for removing offsets when expanding colliding markers
			markers.forEach((marker, index) => {
				marker.bindTooltip(marker.getTooltip()!, { // position tooltip so it doesn't collide with other tooltips/markers
					"offset": L.point(-15, 0), // position so centered over marker
					direction: (index < markers.length/2 ? "bottom" : "top") 
				})
				marker.closePopup(); // close the popup for easier navigation
			})
		})
		this.oms.addListener('unspiderfy', (markers: L.Marker[]) => { // add listener for re-adding offsets when collapsing colliding markers
			markers.forEach((marker) =>
				marker.bindTooltip(marker.getTooltip()!, {
					"offset": L.point(0, 0) // remove original offset in line 74
				})
			)
			this.uncollideTooltips(); // re-add offsets
			markers.forEach((marker) => marker.bindTooltip(marker.getTooltip()!, { direction: "auto" })) // reset direction to auto
		});
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
			${course.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} -- ${course.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
			<br><br>
			Class ${number+1}/${total}
		`)
		marker.addTo(this.map!);

		// create tooltip for showing order of classes
		marker.bindTooltip(`${number+1}`, { 
			permanent: true, 
			opacity: 1,
		})

		marker.getTooltip()

		// add marker to map and store
		this.oms.addMarker(marker);

		return marker;
	}

	/**
	 * draws the route between markers.
	 */
	private drawRoute() {
		// add new lines
		for(let i = 1; i < this.markers.length; i++) {
			let line = L.polyline([this.markers[i-1].getLatLng(), this.markers[i].getLatLng()]);
			line.addTo(this.map!);
			this.lines.push(line);
		}
	}

	/**
	 * Helper method for "uncolliding" tooltips. Moves tooltips out of the way with an offset if they collide.
	 */
	private uncollideTooltips() {
		// add offset to colliding tooltips
		for(let i = this.markers.length - 1; i >= 0; i--) {
			for(let j = i - 1; j >= 0; j--)  {
				let markerI = this.markers[i], markerJ = this.markers[j];
				if(markerI.getLatLng().equals(markerJ.getLatLng()) // if two tooltips are in the same location 
					&& (L.point(0,0).equals(markerJ.getTooltip()!.options.offset!)) // and the second one hasn't been offset yet, then uncollide them
				) { 
					let markerIOffset = markerI.getTooltip()!.options["offset"]!; // get offset of first marker
					let newOffset = L.point(25, 0).add(markerIOffset); // get what that offset would be but an extra step
					markerI.bindTooltip(markerI.getTooltip()!, { offset: newOffset }); // add offset to colliding tooltip
				}
			}
		}
	}
}
