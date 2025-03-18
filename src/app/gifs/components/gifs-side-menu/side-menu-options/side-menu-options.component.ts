import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuOption {
  label: string;
  sublabel: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuOptionsComponent {

  menuOptions: MenuOption[] = [
    {
      label: 'Trending',
      sublabel: 'Gifs Populares',
      route: '/dashboard/trending',
      icon: 'fa-solid fa-chart-line'
    },
    {
      label: 'Search',
      sublabel: 'Buscar gifs',
      route: '/dashboard/search',
      icon: 'fa-solid fa-magnifying-glass'
    }
  ]

}
