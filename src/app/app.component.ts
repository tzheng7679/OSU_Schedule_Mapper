import { Component, QueryList, ViewChildren } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { GetLocsComponent } from "./get-locs/get-locs.component";
import { Course, DAYS } from './get-locs/sched_parser';
import { MapTabComponent } from "./map-tab/map-tab.component";

@Component({
	selector: 'app-root',
	imports: [MapTabComponent, GetLocsComponent, NgOptimizedImage],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	@ViewChildren(MapTabComponent) mapTabs!: QueryList<MapTabComponent>;
	
	public updateMaps(schedules: Course[][]): void {
		schedules.forEach((daySchedule, i) => {
			this.mapTabs.get(i)?.plantClasses(daySchedule);
		})
	}
}
