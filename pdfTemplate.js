module.exports = function pdfTemplate(data) {
    return data.map(item => {
        if (item.type === 'product') {
            return (
                `<div class="pdf__product product">
                    <img src="${item.img}" class="product__left" />
                    <div class="product__right">
                        <div class="product__name">${item.name}</div>
                        <div class="product__brand">${item.brand}</div>
                        <div class="product__quantity">${item.quantity}</div>
                        <div class="product__url">${item.url}</div>
                    </div>
                </div>`
            )
        } else if (item.type === 'break') {
            return (
                `<section class="pdf__page-break"></section>`
            )
        }
    }).join("")
}