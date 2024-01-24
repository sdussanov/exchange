document.addEventListener('DOMContentLoaded', async () => {
    const currencies = ['USD', 'EUR', 'RUB', 'TRY', 'CNY'];

    const updates = currencies.map(curreny=>
        updateExchangeRate(curreny, 'KZT', `${curreny.toLowerCase()}Rate`)
        
        );
    await Promise.all(updates);


    // await updateExchangeRate('USD', 'KZT', 'usdRate');
    // await updateExchangeRate('EUR', 'KZT', 'eurRate');
    // await updateExchangeRate('RUB', 'KZT', 'rubRate');
    // await updateExchangeRate('TRY', 'KZT', 'tryRate');
    // await updateExchangeRate('CNY', 'KZT', 'cnyRate');
});

async function getExchangeRate(fromCurrency, toCurrency) {
    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/c2fb59ed1fc3c7fb0edfd65a/latest/${fromCurrency}`);
        const conversionRates = response.data.conversion_rates;

        if (conversionRates.hasOwnProperty(toCurrency)) {
            return parseFloat(conversionRates[toCurrency]);
        } else {
            throw new Error(`Курс для ${toCurrency} не найден.`);
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function updateExchangeRate(fromCurrency, toCurrency, elementId) {
    try {
        const rate = await getExchangeRate(fromCurrency, toCurrency);
        document.getElementById(elementId).textContent = rate;
        exchangeCurrency = rate;
    } catch (error) {
        console.error(error);
        document.getElementById(elementId).textContent = 'Ошибка загрузки';
    }
}

async function convertCurrency() {
    const amount = document.getElementById('amountInput').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    const resultElement = document.getElementById('result');
    resultElement.textContent = 'Выполняется конвертация...';

    try {
        const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);

        if (!isNaN(exchangeRate)) {
            resultElement.textContent = `Результат: ${(amount * exchangeRate).toFixed(2)}`;
        } else {
            resultElement.textContent = 'Ошибка конвертации';
        }
    } catch (error) {
        console.error(error);
        resultElement.textContent = 'Ошибка загрузки';
    }
}