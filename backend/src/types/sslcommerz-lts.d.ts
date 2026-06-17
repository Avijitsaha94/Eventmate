declare module 'sslcommerz-lts' {
  interface SSLCommerzInitResponse {
    status?: string
    GatewayPageURL?: string
    [key: string]: any
  }

  interface SSLCommerzValidationResponse {
    status?: string
    [key: string]: any
  }

  class SSLCommerzPayment {
    constructor(store_id: string, store_passwd: string, is_live: boolean)
    init(data: Record<string, any>): Promise<SSLCommerzInitResponse>
    validate(data: Record<string, any>): Promise<SSLCommerzValidationResponse>
    initPayment(data: Record<string, any>): Promise<SSLCommerzInitResponse>
    initiateTransaction(data: Record<string, any>): Promise<SSLCommerzInitResponse>
  }

  export default SSLCommerzPayment
}