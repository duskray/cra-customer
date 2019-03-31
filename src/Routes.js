// const AsyncHome = asyncComponent(() => import("./App"))

import React from "react"
import { Route, Switch } from "react-router-dom"
import asyncComponent from "./components/Route/AsyncComponent"
import AppliedRoute from "./components/Route/AppliedRoute"
// import AuthenticatedRoute from "./components/Route/AuthenticatedRoute"
// import UnauthenticatedRoute from "./components/Route/UnauthenticatedRoute"

const Home = asyncComponent(() => import("./containers/Home"))
const StoreList = asyncComponent(() => import("./containers/StoreList"))
const Buy = asyncComponent(() => import("./containers/Buy"))
const OrderSuccess = asyncComponent(() => import("./containers/OrderSuccess"))
const OrderFail = asyncComponent(() => import("./containers/OrderFail"))
const Booking = asyncComponent(() => import("./containers/Booking"))
const BookingEmployeeBuy = asyncComponent(() => import("./containers/BookingEmployeeBuy"))
const BookingTimeBuy = asyncComponent(() => import("./containers/BookingTimeBuy"))
const Options = asyncComponent(() => import("./containers/Options"))
const My = asyncComponent(() => import("./containers/My"))
const Balance = asyncComponent(() => import("./containers/Balance"))
const Charge = asyncComponent(() => import("./containers/Charge"))
const OrderList = asyncComponent(() => import("./containers/OrderList"))
const OrderDetail = asyncComponent(() => import("./containers/OrderDetail"))
const Member = asyncComponent(() => import("./containers/Member"))
const MemberBuy = asyncComponent(() => import("./containers/MemberBuy"))
const CancelReason = asyncComponent(() => import("./containers/CancelReason"))
const CommentComponent = asyncComponent(() => import("./containers/Comment"))
const Coupons = asyncComponent(() => import("./containers/Coupons"))
const Waiters = asyncComponent(() => import("./containers/Waiters"))
const Cards = asyncComponent(() => import("./containers/Cards"))
const Agreement = asyncComponent(() => import("./containers/Agreement"))




export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/store/list" exact component={StoreList} props={childProps} />
    <AppliedRoute path="/buy" exact component={Buy} props={childProps} />
    <AppliedRoute path="/success" exact component={OrderSuccess} props={childProps} />
    <AppliedRoute path="/fail" exact component={OrderFail} props={childProps} />
    <AppliedRoute path="/booking" exact component={Booking} props={childProps} />
    <AppliedRoute path="/booking-employee/buy" exact component={BookingEmployeeBuy} props={childProps} />
    <AppliedRoute path="/booking-time/buy" exact component={BookingTimeBuy} props={childProps} />
    <AppliedRoute path="/options" exact component={Options} props={childProps} />
    <AppliedRoute path="/my" exact component={My} props={childProps} />
    <AppliedRoute path="/balance" exact component={Balance} props={childProps} />
    <AppliedRoute path="/charge" exact component={Charge} props={childProps} />
    <AppliedRoute path="/order" exact component={OrderList} props={childProps} />
    <AppliedRoute path="/order/:id" exact component={OrderDetail} props={childProps} />
    <AppliedRoute path="/member" exact component={Member} props={childProps} />
    <AppliedRoute path="/member/buy" exact component={MemberBuy} props={childProps} />
    <AppliedRoute path="/cancel" exact component={CancelReason} props={childProps} />
    <AppliedRoute path="/comment/:id" exact component={CommentComponent} props={childProps} />
    <AppliedRoute path="/coupons" exact component={Coupons} props={childProps} />
    <AppliedRoute path="/order/:id/waiters" exact component={Waiters} props={childProps} />
    <AppliedRoute path="/cards" exact component={Cards} props={childProps} />
    <AppliedRoute path="/agreement" exact component={Agreement} props={childProps} />
    {/* <UnauthenticatedRoute
      path="/login"
      exact
      component={AsyncLogin}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/signup"
      exact
      component={AsyncSignup}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/notes/new"
      exact
      component={AsyncNewNote}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/notes/:id"
      exact
      component={AsyncNotes}
      props={childProps}
    /> */}
    {/* Finally, catch all unmatched routes */}
    <Route component={Home} />
  </Switch>
