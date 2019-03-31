import React, { Component } from 'react'
import { ListView } from 'antd-mobile'
import PropTypes from 'prop-types'
import './DRListView.module.css'

const pageSize = 10

function ListBody(props) {
  return (
    <div className={"am-list-body " + props.className}>
      {props.children}
    </div>
  );
}

let rowID = 0
function toObject(arr) {
  var rv = {}
  for (var i = 0; i < arr.length; ++i)
    rv[rowID++] = arr[i];
  return rv
}


export default class DRListView extends Component {
  state = {
    isLoading: true,
    hasMore: true,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
  }
  dataBlobs = {}
  pageIndex = 1

  componentDidMount = async () => {
    this.get()
  }


  onEndReached = async (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    this.setState({ isLoading: true })
    const response = await this.props.getter(pageSize, ++this.pageIndex)

    this.dataBlobs = { ...this.dataBlobs, ...toObject(response[this.props.listName]) };
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.dataBlobs),
      hasMore: response.hasMore,
    })
  }

  get = async () => {
    const response= await this.props.getter(pageSize, 1)
    this.dataBlobs = toObject(response[this.props.listName])
    // this.lv.scrollTo(0,0)
    this.pageIndex = 1
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.dataBlobs),
      hasMore: response.hasMore,
    })
  }

  render() {
    return (
      <ListView
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.isLoading && this.state.hasMore ? '加载中...' : '加载完成'}
        </div>)}
        renderBodyComponent={() => <ListBody className={this.props.className} />}
        renderRow={this.props.renderRow}
        // renderHeader={() => <span>header</span>}
        // renderSectionHeader={sectionData => (
        //   <div>{`Task ${sectionData.split(' ')[1]}`}</div>
        // )}
        // renderSeparator={separator}
        // onScroll={() => { console.log('scroll'); }}
        style={{
          height: this.props.height || '100vh',
          overflow: 'auto',
        }}
        pageSize={pageSize}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    )
  }
}

DRListView.propTypes = {
  getter: PropTypes.func,
  renderRow: PropTypes.func,
  listName: PropTypes.string,
  height: PropTypes.string,
}