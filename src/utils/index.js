import ax from 'utils/ax'
import axios from 'axios'

const getUrlParam = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

const orderStatus = {
  0: '待支付',
  1: '已⽀付',
  2: '待服务',
  3: '服务中',
  4: '已完成',
  5: '已评价',
  6: '已取消',
  8: '已关闭',
}

const paymentType = {
  balance: {
    id: '3',
    name: '余额',
    icon: 'piggy-bank',
    color: '#bf2e42',
    string: 'commonBalance',
  },
  storeBalance: {
    id: '4',
    name: '门店余额',
    icon: 'piggy-bank',
    color: '#bf2e42',
    string: 'storeBalance',
  },
  wechat: {
    id: '1',
    name: '微信支付',
    icon: ['fab', 'weixin'],
    color: '#06c104',
    string: 'wechat',
  },
  alipay: {
    id: '2',
    name: '支付宝',
    icon: ['fab', 'alipay'],
    color: '#0490df',
    string: 'alipay',
  },
  0: '微信',
  1: '支付宝',
  2: '一卡通余额',
  3: '团购',
  4: '免单',
  5: 'pos机',
  6: '门店余额',
  7: '现金',
}

const wechatPay = (order, type, successFunc) => {
  axios.get('/WeiXinPayV3/PrePay', {
    params: {
      orderId: order.id,
      sumMoney: order.price,
      type: type,
      store: order.store,
    }
  })
  // ax.get('payParams/' + type, {
  //   id: order.id,
  //   sum: order.price,
  //   cellNumber: order.cellNumber,  // only in charge page
  //   store: order.store,  // only in charge page
  //   payment: 'wechat',
  // })
  .then(r => {
    const { appId, timeStamp, nonceStr, signType, paySign, subMchId, subOpenid } = r
    function onBridgeReady() {
      window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          appId,
          timeStamp,
          nonceStr,
          package: r.package,
          signType,
          paySign,
        },
        function (res) {
          console.log(res)
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            if (successFunc) {
              successFunc()
            }
          }
        }
      )
    }

    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      onBridgeReady();
    }
  })
  .catch(e => {
    console.log(e)
  })
}

export {
  getUrlParam,
  orderStatus,
  paymentType,
  wechatPay,
}