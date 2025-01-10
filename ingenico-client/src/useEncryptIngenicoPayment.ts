/** @See Documentation about the ingenico client SDK integration:
 *  https://docs.connect.worldline-solutions.com/documentation/sdk/mobile/javascript/
 *  https://docs.connect.worldline-solutions.com/payment-product/visa/integration/WOPA
 * */
// @ts-ignore
import cardValidator from 'card-validator'
import {
    EncryptError,
    PaymentDetails,
    ResponseError,
    Session,
    SessionDetails
} from 'connect-sdk-client-js'

import {IngenicoSessionResponse, ChargeSetupData} from './types'
import {getPaymentProductId} from './utils'


interface EncryptIngenicoPaymentType {
    ingenicoData: IngenicoSessionResponse
    maxPrice: number
    cardInfo: ChargeSetupData['cardInfo']
}

const useEncryptEngenicoPayment = async ({
                                         ingenicoData,
                                         maxPrice,
                                         cardInfo
                                     }: EncryptIngenicoPaymentType) => {
    let encryptedPaymentRequest: string
    let paymentProductId: number
    const totalAmountInCents = maxPrice === 0 ? 100 : maxPrice * 100

    try {
        const sessionDetails: SessionDetails = {
            clientSessionId: ingenicoData.clientSessionID,
            customerId: ingenicoData.customerID,
            clientApiUrl: ingenicoData.clientApiUrl,
            assetUrl: ingenicoData.assetUrl
        }
        const session = new Session(sessionDetails)

        const paymentDetails: PaymentDetails = {
            totalAmount: totalAmountInCents,
            locale: 'fr_FR',
            isRecurring: false,
            currency: 'EUR',
            countryCode: 'FR'
        }

        const typeCreditCard = cardInfo && cardValidator.number(cardInfo['cc-number']).card?.type

        const paymentProductId = getPaymentProductId(typeCreditCard)

        const basicPaymentProducts = session.getBasicPaymentProducts(paymentDetails)
        const paymentProduct = await session.getPaymentProduct(paymentProductId, paymentDetails)

        const basicPaymentProduct = (await basicPaymentProducts).getBasicPaymentProduct(
            paymentProductId
        )

        const toAscii = (str: string) => {
            return str.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
        }

        const cardDetails = {
            cardNumber: cardInfo['cc-number'].replace(/\s/g, ''),
            ccv: cardInfo['cc-csc'],
            cardholderName: toAscii(cardInfo['cc-name']),
            expiryDate: `${cardInfo['cc-exp-month']}${cardInfo['cc-exp-year']}`
        }

        const accountOnFileId = 3
        const accountOnFile = basicPaymentProduct.getAccountOnFile(accountOnFileId)
        const paymentRequest = session.getPaymentRequest()

        paymentRequest.setPaymentProduct(paymentProduct)

        paymentRequest.setTokenize(true)

        paymentRequest.setAccountOnFile(accountOnFile)
        paymentRequest.setValue('cardNumber', cardDetails.cardNumber)
        paymentRequest.setValue('cvv', cardDetails.ccv)
        paymentRequest.setValue('cardholderName', cardDetails.cardholderName)
        paymentRequest.setValue('expiryDate', cardDetails.expiryDate)

        const isValid = paymentRequest.isValid()

        if (!isValid) {
            const errors = paymentRequest.validate()

            console.table(errors)

            const errorIds = errors.map((error) => error.errorMessageId)
            console.log(`errors found in: ${errorIds}`)
            return
        }

        const encryptor = session.getEncryptor()
        encryptedPaymentRequest = await encryptor.encrypt(paymentRequest)
    } catch (err) {
        if (err instanceof EncryptError) {
            err.message
            err.validationErrors
        }

        if (err instanceof ResponseError) {
            err.message
            err.response
        }
    }

    return {
        encryptedPaymentRequest,
        paymentProductId
    }
}

export default useEncryptEngenicoPayment

