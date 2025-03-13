import React, { useState } from 'react'

const usePaymentFormValidation = () => {

    //catch error
    const [error, setError] = useState({});

    const formValidation = ({ cardCredentials, paymentType }) => {
        //object for temporary store errors
        const tempError = {};

        if (paymentType === 'visa' || paymentType === 'master') {
            if (!cardCredentials.cardHolderName || cardCredentials.cardHolderName === "") {
                tempError.cardHolderName = "card Holder name required";
            }
            if (!cardCredentials.cardNumber || String(cardCredentials.cardNumber).length < 20) {
                tempError.cardNumber = "Card Number Required";

            }

            if (!cardCredentials.cvv || String(cardCredentials.cvv).length !== 3) {
                tempError.cvv = "Cvv Required";
            }


        }
        else if (paymentType === 'payhere') {
            const mailregex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!cardCredentials.payhereEmail) {
                tempError.payhereEmail = "payeHere email is reqired";
            }
            else if (!mailregex.test(cardCredentials.payhereEmail)) {
                tempError.payhereEmail = "Email type mismatch";
            }
        }
        else if (paymentType === 'onlineTransfer') {
            if (!cardCredentials.bankName) {
                tempError.bankName = "Bank name is required";
            }

            if (!cardCredentials.branch) {
                tempError.branch = "Branch is required";
            }

            if (!cardCredentials.transactionPdf) {
                tempError.transactionPdf = "Transaction PDF is required";
            } else {
                // Check file type
                if (cardCredentials.transactionPdf.type !== "application/pdf") {
                    tempError.transactionPdf = "File must be a PDF";
                }

                // Check file size (e.g., 5MB limit)
                const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                if (cardCredentials.transactionPdf.size > maxSize) {
                    tempError.transactionPdf = "File size must be less than 5MB";
                }
            }
        }
        setError(tempError);
        return (tempError);

    }

    const clearForm = (field) => {
        setError((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[field]; // Remove the error for the specific field
            return updatedErrors;
        });
    };
    return { error, formValidation, clearForm }
}

export default usePaymentFormValidation;

