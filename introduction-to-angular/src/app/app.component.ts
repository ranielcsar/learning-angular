import { Component } from '@angular/core';
import { HousingLocation } from './housing-location';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'fairhouse';
  selectedLocation: HousingLocation | undefined;

  updateSelectedLocation(location: HousingLocation) {
    this.selectedLocation = location;
  }

  housingLocationList: HousingLocation[] = [
    {
      name: 'The Palms',
      city: 'Los Angeles',
      state: 'CA',
      photo: 'https://picsum.photos/200/300',
      availableUnits: 10,
      wifi: true,
      laundry: true,
    },
    {
      name: 'The Beach House',
      city: 'San Francisco',
      state: 'CA',
      photo: 'https://picsum.photos/200/300',
      availableUnits: 7,
      wifi: false,
      laundry: true,
    },
    {
      name: 'The Loft',
      city: 'New York',
      state: 'NY',
      photo: 'https://picsum.photos/200/300',
      availableUnits: 9,
      wifi: true,
      laundry: false,
    },
    {
      name: 'The Villa',
      city: 'Miami',
      state: 'FL',
      photo: 'https://picsum.photos/200/300',
      availableUnits: 5,
      wifi: false,
      laundry: false,
    },
    {
      name: 'The Bungalow',
      city: 'Chicago',
      state: 'IL',
      photo: 'https://picsum.photos/200/300',
      availableUnits: 10,
      wifi: true,
      laundry: true,
    },
  ];
}
