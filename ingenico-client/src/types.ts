type CardInfo = {
    'cc-name': string
    'cc-number': string
    'cc-exp-month': string
    'cc-exp-year': string
    'cc-csc': string
}

export type IngenicoSessionResponse = {
    assetUrl: string
    clientApiUrl: string
    clientSessionID: string
    customerID: string
}

export type ChargeSetupData = {
    connectorID?: string
    cardInfo?: CardInfo
    redirectURL?: string
    isSubmitting?: boolean
}
