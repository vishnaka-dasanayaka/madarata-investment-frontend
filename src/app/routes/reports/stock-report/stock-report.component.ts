import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ReportsService } from "../../../core/_services/reports.service";

@Component({
  selector: "app-stock-report",
  standalone: false,
  templateUrl: "./stock-report.component.html",
  styleUrl: "./stock-report.component.css",
})
export class StockReportComponent implements OnInit {
  sysuser: any;
  LoadUI: boolean = false;

  constructor(
    private authservice: AuthenticationService,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  from_date: String = "";
  to_date: String = "";
  supplier: any[] = [];
  brand: any[] = [];
  model: any[] = [];

  stock_data: any[] = [];
  totals: any = {};

  generateReport() {
    var obj = {
      from_date: this.from_date,
      to_date: this.to_date,
      supplier: this.supplier,
      brand: this.brand,
      model: this.model,
    };

    this.reportsService.generateStockReport(obj).subscribe((data) => {
      if (data.status) {
        this.stock_data = [];
        this.stock_data = data.stock_summary;
        this.totals = data.totals;
      }
    });
  }

  printReport() {
    const printContents =
      document.getElementById("stockReportTable")?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "", "height=800,width=1200");
    printWindow?.document.write(`
    <html>
      <head>
        <title>Stock Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
            font-weight: 600;
          }
          tr:nth-child(even) { background-color: #f9fafb; }
          .badge {
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 12px;
          }
          .badge-primary { background-color: #3b82f6; color: white; }
          .badge-success { background-color: #22c55e; color: white; }
          .badge-danger { background-color: #ef4444; color: white; }
        </style>
      </head>
      <body>
        <h2 style="text-align:center;">Stock Report</h2>
        ${printContents}
      </body>
    </html>
  `);

    printWindow?.document.close();
    printWindow?.print();
  }
}
