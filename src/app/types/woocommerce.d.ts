declare module "@woocommerce/woocommerce-rest-api" {
    import { AxiosInstance } from "axios";
  
    interface WooCommerceRestApiOptions {
      url: string;
      consumerKey: string;
      consumerSecret: string;
      version?: string;
    }
  
    interface WooResponse<T> {
      data: T;
    }
  
    class WooCommerceRestApi {
      constructor(options: WooCommerceRestApiOptions);
      get<T = unknown>(endpoint: string, params?: Record<string, unknown>): Promise<WooResponse<T>>;
      post<T = unknown>(endpoint: string, data: Record<string, unknown>): Promise<WooResponse<T>>;
      put<T = unknown>(endpoint: string, data: Record<string, unknown>): Promise<WooResponse<T>>;
      delete<T = unknown>(endpoint: string, params?: Record<string, unknown>): Promise<WooResponse<T>>;
      instance: AxiosInstance;
    }
  
    export default WooCommerceRestApi;
  }
  