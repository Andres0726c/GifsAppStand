import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuHeaderComponent } from '../../components/gifs-side-menu/side-menu-header/side-menu-header.component';
import { SideMenuOptionsComponent } from '../../components/gifs-side-menu/side-menu-options/side-menu-options.component';
import { GifsSideMenuComponent } from '../../components/gifs-side-menu/gifs-side-menu.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, GifsSideMenuComponent],
  templateUrl: './dashboard-page.component.html'
})
export default class DashboardPageComponent { }
