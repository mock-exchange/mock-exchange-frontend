// Common formats
import { format } from 'date-fns'

const locale = 'en-US'

const currencyUSDFormat = new Intl.NumberFormat(locale, {
  style: 'currency', currency: 'USD' });

const currencyUSDNoDecimalFormat = new Intl.NumberFormat(locale, {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
  maximumFractionDigits: 0 });

const percentFormat = new Intl.NumberFormat(locale, {
  style: 'percent', minimumFractionDigits: 1,
  maximumFractionDigits: 1 });

const numberFormat = new Intl.NumberFormat(locale);

const compactNumberFormat = new Intl.NumberFormat(locale, {
  notation: "compact" , compactDisplay: "short",
  minimumFractionDigits: 0, maximumFractionDigits: 1 });

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

  currency_usd(value, trunc_decimal) {
    if (trunc_decimal){
      return currencyUSDNoDecimalFormat.format(value)
    }
    else {
      return currencyUSDFormat.format(value)
    }
  },

  currency_btc(value) {
    return 'fix me'
  },

  percent(value) {
    return percentFormat.format(value)
  },

  number(value) {
    return numberFormat.format(value)
  },

  compact_number(value) {
    return compactNumberFormat.format(value)
  },

  order_num(value) {
    return value.toString().padStart(8, '0')
  }
}


