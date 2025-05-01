import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
	selector: 'app-get-locs',
	imports: [ReactiveFormsModule],
	templateUrl: './get-locs.component.html',
	styleUrl: './get-locs.component.css',
})
export class GetLocsComponent {
	file = new FormControl(null);

	onUpload(event: Event) {
		
	}
}
