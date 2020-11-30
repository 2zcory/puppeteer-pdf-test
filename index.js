const express = require('express')
const http = require('http')
const puppeteer = require('puppeteer')
const cors = require('cors')
const pdfTemplate = require('./pdfTemplate')
const bodyParser = require('body-parser')


const app = express()
const server = http.createServer(app)
server.listen(5000, '192.168.1.23', () => console.log('server running at http://192.168.1.23:5000'))


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

async function printPDF(pageData) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://192.168.1.23:8000/', { waitUntil: 'networkidle0' });
    await page.evaluate((content) => {
        const pdfContent = document.querySelector(".pdf__content")
        pdfContent.innerHTML = content

    }, pdfTemplate(pageData))
    const pdf = await page.pdf({
        format: 'A4',
        displayHeaderFooter: true,
        footerTemplate: '<div/>',
        footerTemplate: '<table style="width: 100%;margin-bottom:-16px"> <tr> <td style="text-align:center"> <div style="font-size: 10px;color:#394058"> <p>page <span class="pageNumber"></span> of <span class="totalPages"></span></p> </div> </td> </tr> </table>',
        margin: {
            top: '32px',
            bottom: '60px',
            // right: '30px',
            // left: '30px',
        },
    });

    await browser.close();
    return pdf
}

app.post('/generate', (req, res) => {
    const pageData = req.body.params
    console.log(pageData)
    printPDF(pageData).then(pdf => {
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
        res.send(pdf)
    })
})

// app.listen(5000, () => console.log(`App run`))