import ax from 'utils/ax'

const request = (url) => {
  return params => ax.post(url, params)
}

const api = {
  // getToken: (p) => request('Weixin/GetTokenByOther')(p),
  login: (p) => request('api/Services/用户端_个人信息/用户_登录')(p),
  getUser: (p) => request('api/Services/用户端_个人信息/用户_个人详情')(p),

  getStoreList: (p) => request('api/Services/用户端_买单/门店_获取门店列表')(p),
  getNearestStore: (p) => request('api/Services/用户端_买单/门店_获取最近门店信息')(p),
  getStoreDetail: (p) => request('api/Services/用户端_买单/门店_获取门店详情')(p),
  getServiceDetail: (p) => request('api/Services/用户端_买单/门店项目_查询项目信息')(p),
  getEmployeeDetail: (p) => request('api/Services/用户端_买单/员工_获取员工详情')(p),
  getEnableCouponList: (p) => request('api/Services/用户端_买单/用户_优惠券选择')(p),
  getRateWords: (p) => request('api/Services/用户端_订单管理/用户_评价订单')(p),
  postRate: (p) => request('api/Services/用户端_订单管理/用户评价_用户评分')(p),
  getCancelReason: (p) => request('api/Services/用户端_订单管理/客户_取消订单')(p),
  orderCancel: (p) => request('api/Services/用户端_订单管理/订单_取消订单')(p),
  getOrderList: (p) => request('api/Services/用户端_订单管理/订单_获取用户订单列表')(p),
  getOrderDetail: (p) => request('api/Services/用户端_订单管理/用户_订单查看')(p),
  getAppointMenu: (p) => request('api/Services/用户端_预约/预约_所有技师时间信息')(p),
  getAppointList: (p) => request('api/Services/用户端_预约/订单_获取未服务预约订单列表')(p),
  getAppointEmployees: (p) => request('api/Services/用户端_预约/预约_可用技师')(p),
  getAppointTime: (p) => request('api/Services/用户端_预约/员工_查询技师可预约时间')(p),
  getServiceByEmployee: (p) => request('api/Services/用户端_预约/项目_获取技师项目')(p),
  getUserCoupon: (p) => request('api/Services/用户端_买单/用户_查询用户优惠券列表')(p),
  deleteOrder: (p) => request('api/Services/用户端_订单管理/订单_删除')(p),
  getPrice: (p) => request('api/Services/用户端_订单管理/支付_计算应支付价格')(p),
  getAuthCode: (p) => request('api/Services/用户端_个人信息/用户_发送验证码')(p),
  getCards: (p) => request('api/Services/用户端_个人信息/用户_钱包详情')(p),
  getChargeLevel: (p) => request('api/Services/用户端_个人信息/支付_档次')(p),
  getChargeList: (p) => request('api/Services/用户端_个人信息/账户余额_查询充值消费明细列表')(p),
  createOrder: (p) => request('api/Services/用户端_预约/订单_创建订单')(p),
  getOrderQrcode: (p) => request('api/Services/用户端_订单管理/订单_获取开单二维码')(p),
  getEmployeeByService: (p) => request('api/Services/用户端_买单/员工_门店技师')(p), // TODO
  patchOrderEmployee: (p) => request('api/Services/用户端_订单管理/买单_自选技师')(p), // TODO
}

export default api