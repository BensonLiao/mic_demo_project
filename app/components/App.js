import ReactDOM from 'react-dom'
import Typography from 'material-ui/Typography'
import Table  from 'material-ui/Table'
import TableBody from 'material-ui/Table/TableBody'
import TableCell from 'material-ui/Table/TableCell'
import TableRow from 'material-ui/Table/TableRow'
import update from 'immutability-helper'
import LoginButton from './LoginButton'
import DemoLineChart from './DemoLineChart'
import Notify from './Notify'

const contentDefault = {
  display: 'flex', 
  justifyContent: 'center', 
  marginBottom: 20,
}

export default class App extends React.Component {
  state = {
    info: 'Please login to get device info and data, Thanks!',
    accessToken: '',
    refreshToken: '',
    deviceInfo: {},
    websocket: {},
    measureData: {
      labels: [],
      datasets: [
        {
          label: 'Temperature',
          fillColor: 'rgba(255, 0, 0, 0.2)',
          strokeColor: 'rgba(255, 0, 0, 1)',
          pointColor: 'rgba(255, 0, 0, 1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(255, 0, 0, 1)',
          data: []
        },
        {
          label: 'Humidity',
          fillColor: 'rgba(0, 0, 255, 0.2)',
          strokeColor: 'rgba(0, 0, 255, 1)',
          pointColor: 'rgba(0, 0, 255, 1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(0, 0, 255, 1)',
          data: []
        }
      ]
    },
    openNotify: false,
    notifyDuration: null,
    notifyMsg: 'This is a notification',
  }

  createTokens = (myAccessToken, myRefreshToken) => {
    console.log('createTokens...')
    this.setState({ accessToken: myAccessToken, refreshToken: myRefreshToken })
  }

  changeDeviceInfo = (info, deviceInfo) => {
    console.log('changeDeviceInfo...')
    this.setState({ info: info, deviceInfo: deviceInfo })
  }

  createWebsocket = (mySocket) => {
    console.log('createWebsocket...')
    this.setState({ websocket: mySocket })
  }

  connectAndSendDataToWebsocket = (myAccessToken, myRefreshToken, myDeviceId) => {
    console.log('connectAndSendDataToWebsocket...')
    //Create a websocket and listening to server
    let mySocket = this.state.websocket
    mySocket = new WebSocket('ws://k8s.comismart.com/api/websocket')
    this.createWebsocket(mySocket)
    mySocket.onopen = function(e) {
      e.persist()
      console.log('Connected to the websocket server')
      console.log(e.code)
      let sendData = JSON.stringify({
        action: 'authenticate',
        token: myAccessToken ? myAccessToken : this.state.accessToken,
      })
      mySocket.send(sendData)
      sendData = JSON.stringify({
        action: 'notification/subscribe',
        deviceId: myDeviceId ? myDeviceId : this.state.deviceInfo.id,
        names:  ['measurement'],
      })
      mySocket.send(sendData)
    }
    mySocket.onmessage = function(e) {
      e.persist()
      console.log('Receiving message require(the websocket server')
      let data = JSON.parse(e.data)
      // console.log(data)
      if (data.action.indexOf('insert') != -1) {
        console.log('Updating the measure data...')
        //Updating the measure data
        this.updateMeasureData(data.notification)
      }
    }.bind(this) //Bind the Main class object to the closure
    mySocket.onclose = function(e) {
      e.persist()
      console.log('Disconnected to the websocket server')
      console.log(e.data)
    }
    mySocket.onerror = function(e) {
      e.persist()
      console.log('ERROR require(the websocket server:')
      console.log(e.data)
    }
  }

  closeWebsocket = () => {
    console.log('closeWebsocket...')
    if (this.state.websocket) this.state.websocket.close()
  }
  
  clearMeasureData = () => {
    console.log('clearMeasureData...')
    let { measureData } = this.state
    measureData = update(measureData, {
      datasets: [
        {
          data: {$set: []}
        },
        {
          data: {$set: []}
        }
      ]
    })
    this.setState({ measureData })
  }

  updateMeasureData = (data) => {
    console.log('updateMeasureData...')
    // console.log('data.parameters.temperature.value = '+data.parameters.temperature.value)
    let { measureData } = this.state
    measureData = update(measureData, {
      labels: {$push: [data.timestamp]},
      datasets: [
        {
          label: {$set: 'Temperature '+data.parameters.temperature.unit},
          data: {$push: [data.parameters.temperature.value]}
        },
        {
          label: {$set: 'Humidity '+data.parameters.humidity.unit},
          data: {$push: [data.parameters.humidity.value]}
        }
      ]
    })
    const tooManyMeasureData = measureData.datasets[0].data.length > 50 || measureData.datasets[1].data.length > 50
    if (tooManyMeasureData) {
      this.closeWebsocket()
      const msg = 'Prevent the data from growing too large, this is just for basic demo'
      this.handleNotifyOpen(msg, 6000)
    } else {
      this.setState({ measureData })
    }
  }

  handleNotifyOpen = (msg, notifyDuration) => {
    this.setState({ openNotify: true, notifyMsg: msg, notifyDuration: notifyDuration })
  }

  handleNotifyClose = () => {
    this.setState({ openNotify: false })
  }

  render() {
    const { info, deviceInfo, accessToken, refreshToken, websocket, measureData, openNotify, notifyDuration, notifyMsg } = this.state
    const hasMeasureData = measureData.datasets[0].data.length > 0 || measureData.datasets[1].data.length > 0
    // console.log(measureData)
    return (
      <div>
        <div style={contentDefault}>
          <LoginButton 
          setWebsocket={this.createWebsocket}
          setTokens={this.createTokens}
          handleDeviceInfo={this.changeDeviceInfo} 
          closeWebsocket={this.closeWebsocket}
          clearMeasureData={this.clearMeasureData}
          updateMeasureData={this.updateMeasureData}/>
        </div>
        <hr></hr>
        <div style={contentDefault}>
          <Typography variant='display1'>{info}</Typography>
        </div>
        {deviceInfo && 
        <div style={contentDefault}>
          <Table>
            <TableBody>
              {Object.keys(deviceInfo).map((key, idx) => {
                return (
                  <TableRow key={idx}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{typeof deviceInfo[key] == 'string' ? deviceInfo[key] : JSON.stringify(deviceInfo[key])}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>}
        {hasMeasureData && 
        <div style={contentDefault}>
          <DemoLineChart chartData={measureData}/>
        </div>}
        <Notify 
          open={openNotify} 
          notifyDuration={notifyDuration}
          msg={notifyMsg} 
          handleClose={this.handleNotifyClose}
        />
      </div>
    )
  }
}

if (document.getElementById('test_root')) {
  // console.log('root founded.');
  ReactDOM.render(<App />, document.getElementById('test_root'));
}
