const CardType = {
    AMERICAN_EXPRESS: 'american-express',
    AMEX: 'amex',
    DINERS_CLUB: 'diners-club',
    JCB: 'jcb',
    MAESTRO: 'maestro',
    MASTERCARD: 'mastercard',
    VISA: 'visa'
} as const

const paymentProduct = {
    [CardType.AMERICAN_EXPRESS]: {
        id: 2,
        logo: '/kitt/icons/icon-card-amex.svg',
        name: 'American Express'
    },
    [CardType.AMEX]: {
        id: 2,
        logo: '/kitt/icons/icon-card-amex.svg',
        name: 'American Express'
    },
    [CardType.DINERS_CLUB]: {
        id: 132,
        logo: '/kitt/icons/icon-card-diners-club.svg',
        name: 'Diners Club'
    },
    [CardType.JCB]: {
        id: 125,
        logo: '/kitt/icons/icon-card-jcb.svg',
        name: 'JCB'
    },
    [CardType.MAESTRO]: {
        id: 117,
        logo: '/kitt/icons/icon-card-maestro.svg',
        name: 'Maestro'
    },
    [CardType.MASTERCARD]: {
        id: 3,
        logo: '/kitt/icons/icon-card-mastercard.svg',
        name: 'Mastercard'
    },
    [CardType.VISA]: {
        id: 1,
        logo: '/kitt/icons/icon-card-visa.svg',
        name: 'Visa'
    }
}

export const getPaymentProductId = (cardType: string): number | null =>
    paymentProduct[cardType].id ?? null

export const getCardLogo = (cardType: string) => paymentProduct[cardType].logo ?? null

export const getCardName = (cardType: string) => paymentProduct[cardType].name ?? null
