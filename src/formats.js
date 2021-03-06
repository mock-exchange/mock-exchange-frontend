// Common formats
import { format, formatDistanceStrict } from 'date-fns'

const locale = 'en-US'

const currencyUSDFormat = new Intl.NumberFormat(locale, {
  style: 'currency', currency: 'USD' });

const currencyUSDNoDecimalFormat = new Intl.NumberFormat(locale, {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0,
  maximumFractionDigits: 0 });

const numberFormat = new Intl.NumberFormat(locale);

const compactNumberFormat = new Intl.NumberFormat(locale, {
  notation: "compact" , compactDisplay: "short",
  minimumFractionDigits: 0, maximumFractionDigits: 1 });

const balanceNumberFormat = new Intl.NumberFormat(locale, {
  notation: "compact" , compactDisplay: "short",
  minimumFractionDigits: 3, maximumFractionDigits: 3 });


export default {
  relative_dt(dt1, dt2){
    return formatDistanceStrict(dt1, dt2)
  },

  datetime(dt) {
    return format(Date.parse(dt), 'yyy-MM-dd hh:mm:ss aaa');
  },

  date(dt) {
    return format(Date.parse(dt), 'yyyy-MM-dd')
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

  currency(value, asset) {
    if (!asset){
      asset = {
        symbol: 'USD',
        scale: 2
      }
    }
    let f = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: asset.symbol,
      minimumFractionDigits: asset.scale,
      maximumFractionDigits: asset.scale
    })
    console.log("currency asset:",asset)
    return f.format(value)
  },

  currency_btc(value) {
    return 'fix me'
  },

  percent(value, scale = 0) {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: scale,
      maximumFractionDigits: scale
    }).format(value);
  },

  number(value, scale = 0) {
    return Intl.NumberFormat(locale, {
      minimumFractionDigits: scale,
      maximumFractionDigits: scale
    }).format(value)
  },

  compact_number(value) {
    return compactNumberFormat.format(value)
  },

  balance(value) {
    return balanceNumberFormat.format(value)
  },

  fullnum(value) {
    var f = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 8, maximumFractionDigits: 8 }
    );
    return f.format(value);
  },

  order_num(value) {
    return value.toString().padStart(8, '0')
  },

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
}


