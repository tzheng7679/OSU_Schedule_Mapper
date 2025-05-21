import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { processData, DAYS, Course, FRI } from './sched_parser';


@Component({
	selector: 'app-get-locs',
	imports: [ReactiveFormsModule],
	templateUrl: './get-locs.component.html',
	styleUrl: './get-locs.component.css',
})
export class GetLocsComponent {
	text = new FormControl("", );
	@Output() emitSchedulesEvent = new EventEmitter<Course[][]>;

	async onUpdate() {
		let courses = await processData(this.text.value as string);
		this.emitSchedulesEvent.emit(this.getDaySchedule(courses));
	}

	/**
	 * Helper method for formatting `Array<Course>` as a 2d matrix of courses in order
	 * 
	 * @param courses 
	 * @returns A 2d matrix of courses in chronological order
	 */
	private getDaySchedule(courses: Course[]) {
		let schedules = [];

		for(let day of DAYS) {
			let daySchedule: Course[] = [];
			for(let course of courses) {
				if(course.days.includes(day)) {
					daySchedule.push(course);
				}
			}
			daySchedule.sort((a, b) => (a.start.getTime() - b.start.getTime()))	
			
			schedules.push(daySchedule);
		}

		return schedules;
	}
}
