
export interface Offer {
  offerId: number;
  taskId: number;
  taskName: string;
  providerName:string;
  status: string;
  // TODO: add other properties returned by your /offers endpoints (e.g. providerId, status, etc.)
}

export interface CreateOfferPayload {
  taskId: number;
}

export interface GetMyOffersResponse {
  offers: Offer[];
}

export interface GetOffersOnUserTasksResponse {
  offers: Offer[];
}
