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
		let courses = processData(this.text.value as string); 
		console.log(courses);

		
// use geocoder api at https://gissvc.osu.edu/arcgis/rest/services/Apps/Campusmap_OSU_Buildings_Locator/GeocodeServer/findAddressCandidates?Address=&Address2=&Address3=&Neighborhood=&City=&Subregion=&Region=&Postal=&PostalExt=&CountryCode=&SingleLine=&outFields=&maxLocations=&matchOutOfRange=true&langCode=&locationType=&sourceCountry=&category=&location=&searchExtent=&outSR=4140&magicKey=dHA9MCNsb2M9MjU4I2xuZz0wI2ZhPTY1NTM2&preferredLabelValues=&f=html

// make sure to use output spatial reference of 4140; this gives the lattitude and longitude as the output coordinates, instead of some weird projected bullshit

// use magic key from suggest api to make life easy
	}

	
}
