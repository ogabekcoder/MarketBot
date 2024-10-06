const { google } = require("googleapis")

// Initializes the Google APIs client library and sets up the authentication using service account credentials.
const auth = new google.auth.GoogleAuth({
    keyFile: "./credentials.json", // Path to your service account key file.
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Scope for Google Sheets API.
})

// Asynchronous function to write data to a Google Sheet.
async function writeToSheet(values) {
    console.log("Writing values to sheet:", values)

    const sheets = google.sheets({ version: "v4", auth }) // Creates a Sheets API client instance.
    const spreadsheetId = "1cIfeyA26tUt48NyAO8f46CHzOvkJNi--nys28pEx-EQ" // The ID of the spreadsheet.

    // Qaysi qator va ustunlardan boshlab yozish kerakligini aniqlash
    const startRow = 1 // 1-qatordan boshlash
    const startColumn = 1 // A-ustundan boshlash
    const range = `R${startRow}C${startColumn}:R${startRow + values.length - 1}C${
        startColumn + values[0].length - 1
    }` // Dynamic range based on input

    const valueInputOption = "USER_ENTERED" // How input data should be interpreted.
    const resource = { values } // The data to be written.

    try {
        const res = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        })
        console.log("Cells updated:", res.data.updatedCells) // Logs the number of cells updated.
        return res // Returns the response from the Sheets API.
    } catch (error) {
        console.error("Error writing to sheet:", error) // Logs errors.
    }
}

// Asynchronous function to read data from a Google Sheet.
async function readSheet() {
    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = "1cIfeyA26tUt48NyAO8f46CHzOvkJNi--nys28pEx-EQ"
    const range = "A1:E10" // Specifies the range to read.

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        })
        const rows = response.data.values // Extracts the rows from the response.
        return rows // Returns the rows.
    } catch (error) {
        console.error("error", error) // Logs errors.
    }
}

module.exports = { writeToSheet, readSheet }
