// Common formats
import { format } from 'date-fns'

const currencyUSDFormat = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD' });

const percentFormat = new Intl.NumberFormat('en-US', {
    style: 'percent', minimumFractionDigits: 1,
    maximumFractionDigits: 1 });

const numberFormat = new Intl.NumberFormat('en-US');


export default {
    datetime(dt) {
        return format(Date.parse(dt), 'yyyy-mm-dd hh:mm:ss aaa')
    },

    date(dt) {
        return format(Date.parse(dt), 'yyyy-mm-dd')
    },

    time(dt) {
        return format(Date.parse(dt), 'hh:mm:ss aaa')
    },

    currency_usd(value) {
        return currencyUSDFormat.format(value)
    },

    currency_btc(value) {
        return 'fix me'
    },

    percent(value) {
        return percentFormat.format(value)
    },

    number(value) {
        return numberFormat.format(value)
    }
}


