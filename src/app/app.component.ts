import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapTabComponent } from "./map-tab/map-tab.component";
import { GetLocsComponent } from "./get-locs/get-locs.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapTabComponent, GetLocsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'osu_schedule_map';
}
