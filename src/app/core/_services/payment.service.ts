import { Injectable } from "@angular/core";
import md5 from "crypto-js/md5";

declare var window: any;

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  constructor() {}

  payNow(data: any, hash: string) {
    // let merchantSecret  = 'NDIwNTQ2NzI0NjYxNzM3OTYyMjM0NDIzNzczMTMxMDM4NjI3MTA=';
    // let merchantId      = data.merchant_id;
    // let orderId         = data.order_id;
    // let amount          = data.amount;
    // let hashedSecret    = md5(merchantSecret).toString().toUpperCase();
    // let amountFormated  = parseFloat( amount ).toLocaleString( 'en-us', { minimumFractionDigits : 2 } ).replaceAll(',', '');
    // let currency        = data.currency;
    // let hash            = md5(merchantId + orderId + amountFormated + currency + hashedSecret).toString().toUpperCase();

    window.payhere.onCompleted = function (orderId: string) {
      console.log("Payment completed. OrderID:", orderId);
    };

    window.payhere.onDismissed = function () {
      console.log("Payment dismissed");
    };

    window.payhere.onError = function (error: any) {
      console.log("Payment error:", error);
    };

    const payment = {
      sandbox: true,
      merchant_id: data.merchant_id,
      return_url:
        "http://localhost:4200/tickets/new-tickets/" + data.order_id,
      cancel_url: "http://localhost:4200/ticket-details",
      notify_url: "https://happysales.lk/api/v1/bookings/notify",
      order_id: data.order_id,
      items: data.items,
      amount: data.amount,
      currency: data.currency,
      hash: hash,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      country: data.country,
      city: data.city,
      address: data.address,
      recurrence: "1 Month",
      duration: "1 Year",
      custom_1: data.custom_1,
    };

    window.payhere.startPayment(payment);
  }
}
