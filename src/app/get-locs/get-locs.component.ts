import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { processData } from './sched_parser';

@Component({
	selector: 'app-get-locs',
	imports: [ReactiveFormsModule],
	templateUrl: './get-locs.component.html',
	styleUrl: './get-locs.component.css',
})
export class GetLocsComponent {
	text = new FormControl("", );

	onUpdate() {
		console.log(processData(this.text.value as string));
	}
}
