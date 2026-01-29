import { Component, HostListener, OnInit } from "@angular/core";
import { EventService } from "../../../core/_services/event.service";
import { LocationService } from "../../../core/_services/location.service";
import moment from "moment";

@Component({
  selector: "app-home",
  standalone: false,
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  loadUI: boolean = false;
  events: any;
  locations: string[] = [];

  selectedLocation: string | null = null;
  rangeDates: any;

  page: number = 0;
  fromEvent!: number;
  toEvent!: number;
  totalElements!: number;
  totalPages!: number;
  serchText!: string;
  favourite: boolean = false;
  authorized: boolean = false;

  isSticky: boolean = false;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const offset =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isSticky = offset > 100; // adjust 100 to when you want it to stick
  }

  constructor(
    private eventService: EventService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.getEvents();
    this.getLocations();
  }

  getEvents(filters?: any) {

    filters = filters || {};
    filters.status = "ACTIVE";
    filters.size = 12;
    filters.searchQuery = this.serchText;
    filters.page = this.page;


    this.eventService.getEvents(filters, this.authorized).subscribe((data) => {
      if (data) {
        this.events = data.content;
        this.totalElements = data.totalElements;
        this.fromEvent = this.page * data.size + 1;
        this.toEvent = this.fromEvent + data.numberOfElements - 1;
        this.totalPages = data.totalPages;
        this.loadUI = true;
      }
    });
  }

  getLocations() {
    this.locationService.getLocation().subscribe((data) => {
      if (data) {
        this.locations = data;
      }
    });
  }

  onLocationSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLocation = selectElement.value;

    const filters: any = {};

    filters.locations = [this.selectedLocation];

    if (this.rangeDates) {
      filters.fromDate = moment(this.rangeDates[0]).format("YYYY-MM-DD");
      filters.toDate = moment(this.rangeDates[1]).format("YYYY-MM-DD");
    }

    this.getEvents(filters);
  }

  onDateChange(): void {
    this.loadUI = false;
    const filters: any = {};

    if (this.rangeDates) {
      filters.fromDate = moment(this.rangeDates[0]).format("YYYY-MM-DD");
      filters.toDate = moment(this.rangeDates[1]).format("YYYY-MM-DD");
    }
    if (this.selectedLocation) filters.locations = [this.selectedLocation];

    this.getEvents(filters);
  }

  clearFilters(): void {
    this.selectedLocation = null;
    this.rangeDates = undefined;
    this.favourite = false;
    this.getEvents();
  }

  onPrevClick() {
    if (this.page != 0) {
      this.loadUI = false;
      this.page--;
      this.getEvents();
    }
  }

  onNextClick() {
    if (this.page != this.totalPages - 1) {
      this.loadUI = false;
      this.page++;
      this.getEvents();
    }
  }

  onSerchTextChage() {
    this.page = 0;
    this.getEvents();
  }

  onHeartClick(event: MouseEvent, item: any) {
    event.stopPropagation();

    if (item.favourite) {
      this.eventService.removeFavourite(item.eventId).subscribe({
        next: () => {
          this.getEvents();
        },
        error: (err) => {
          console.error("Failed to remove favourite:", err);
        },
      });
    } else {
      this.eventService.addFavourite(item.eventId).subscribe({
        next: () => {
          this.getEvents();
        },
        error: (err) => {
          console.error("Failed to add favourite:", err);
        },
      });
    }
  }

  getFavourites(): void {
    this.loadUI = false;
    const filters: any = {};

    if (this.rangeDates) {
      filters.fromDate = moment(this.rangeDates[0]).format("YYYY-MM-DD");
      filters.toDate = moment(this.rangeDates[1]).format("YYYY-MM-DD");
    }
    if (this.selectedLocation) filters.locations = [this.selectedLocation];

    filters.userFavourite = true;

    this.getEvents(filters);
  }

  handleAllButton(): void {
    this.loadUI = false;
    this.clearFilters();
  }
}
