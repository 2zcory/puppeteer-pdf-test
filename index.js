const express = require('express')
const puppeteer = require('puppeteer')
const cors = require('cors')


const app = express()
app.use(cors())


async function printPDF() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:8000/', { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });

    await browser.close();
    return pdf
}

app.get('/generate', (req, res) => {
    console.log('here')
    printPDF().then(pdf => {
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
        res.send(pdf)
    })
})

app.listen(5000, () => console.log(`App run`))