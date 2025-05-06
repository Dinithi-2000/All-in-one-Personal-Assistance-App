const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

export const generatePaySheetPDF = async (retrieveSelectedProvider, salaryDetails) => {

    //create new pdf
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    //set font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    //content
    const { totalEarnings, commission, netSalary, EPF, ETF } = salaryDetails;

    const text =
        `Paysheet for ${provider.FirstName} ${provider.LastName}
    ------------------------------------------------
    Total Earnings: $${totalEarnings.toFixed(2)}
    EPF (5%): $${EPF.toFixed(2)}
    ETF (5%): $${ETF.toFixed(2)}
    Commission : $${commission.toFixed(2)}
    Net Salary: $${netSalary.toFixed(2)}
`;
    page.drawText(text, {
        x: 50,
        y: 350,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
    });

    // Save the PDF as a buffer
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;

}