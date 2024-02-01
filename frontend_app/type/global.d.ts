export {}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: string
      NEXT_PUBLIC_ALCHEMY_ID: string
      NEXT_PUBLIC_DAO_ADDRESS: string
      NEXT_PUBLIC_LM_TOKEN_ADDRESS: string
    }
  }
}
