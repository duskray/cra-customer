import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { TabBar } from 'antd-mobile';
import styles from './NavBar.module.scss';
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { ReactComponent as IconHome } from '../assets/ic_home_c.svg'
import { ReactComponent as IconOrder } from '../assets/ic_order.svg'
// import { ReactComponent as IconPrime } from '../assets/ic_prime_c.svg'
import { ReactComponent as IconAccount } from '../assets/ic_account_c.svg'

class Navbar extends Component {
  state = {

  }

  render() {
    const { history } = this.props

    return (
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%' }}>
        <TabBar
          unselectedTintColor="var(--base-color)"
          tintColor="var(--main-color)"
          barTintColor="white"
          hidden={this.state.tabBarHidden}
        >
          <TabBar.Item
            title="首页"
            key="home"
            icon={ <IconHome className={styles.icon} /> }
            selectedIcon={<IconHome className={classnames(styles.selected, styles.icon)} />}
            selected={history.location.pathname === '/'}
            onPress={() => {
              history.push('/')
            }}
          >
          </TabBar.Item>
          <TabBar.Item
            icon={ <IconOrder className={styles.icon} /> }
            selectedIcon={<IconOrder className={classnames(styles.selected, styles.icon)} />}
            title="预约"
            key="booking"
            selected={history.location.pathname === '/booking'}
            onPress={() => {
              if (this.props.beforePush) {
                this.props.beforePush()
              } else {
                history.push('/booking')
              }
            }}
          >
          </TabBar.Item>
          {/* <TabBar.Item
            icon={ <IconPrime className={styles.icon} /> }
            selectedIcon={<IconPrime className={classnames(styles.selected, styles.icon)} />}
            title="会员卡"
            key="card"
            selected={history.location.pathname === '/card'}
            onPress={() => {
              history.push('/card')
            }}
          >
          </TabBar.Item> */}
          <TabBar.Item
            icon={ <IconAccount className={styles.icon} /> }
            selectedIcon={<IconAccount className={classnames(styles.selected, styles.icon)} />}
            title="我的"
            key="my"
            selected={history.location.pathname === '/my'}
            onPress={() => {
              if (this.props.beforePush) {
                this.props.beforePush()
              } else {
                history.push('/my')
              }
            }}
          >
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

Navbar.propTypes = {
  beforePush: PropTypes.func,
}

export default withRouter(Navbar)
