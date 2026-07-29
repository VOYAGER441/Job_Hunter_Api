export interface IVerifyPaymentRequest {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface IWebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        method: string;
        status: string;
        captured: boolean;
        email: string;
        contact: string;
        fee: number;
        tax: number;
        error_code?: string;
        error_description?: string;
        created_at: number;
      };
    };
  };
}