import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapTabComponent } from "./map-tab/map-tab.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapTabComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'osu_schedule_map';
}
