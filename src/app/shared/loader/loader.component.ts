import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-loader",
  standalone: false,
  templateUrl: "./loader.component.html",
  styleUrl: "./loader.component.css",
})
export class LoaderComponent implements OnInit {
  @Input() type: string | undefined;

  ngOnInit(): void {}
}
