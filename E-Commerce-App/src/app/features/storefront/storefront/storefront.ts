import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './storefront.html',
  styleUrls: ['./storefront.scss']
})
export class Storefront {}