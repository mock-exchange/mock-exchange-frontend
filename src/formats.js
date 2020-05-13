// Common formats
import { format } from 'date-fns'

const numberFormatUSD = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD' });


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
        return numberFormatUSD.format(value)
    },

    currency_btc(value) {
        return 'fix me'
    }
}


