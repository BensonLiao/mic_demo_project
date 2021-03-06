import Button from 'material-ui/Button'

var reqInstance = axios.create({
  headers: {
    common: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
  xsrfCookieName: null, //Remove the X-CSRF-TOKEN cookie from the instance
  xsrfHeaderName: null, //Remove the X-CSRF-TOKEN header from the instance
})

reqInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  console.log(config)
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
})

export default class LoginButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      login: false,
      stop: false,
      accessToken: '',
      refreshToken: '',
      xmlhttp: {},
      websocket: {},
    }
    this.doLogin = this.doLogin.bind(this)
    this.doLogout = this.doLogout.bind(this)
  }

  componentDidMount() {
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.addEventListener("load", transferComplete)
    xmlhttp.addEventListener("error", transferFailed)
    xmlhttp.addEventListener("abort", transferCanceled)
    function transferComplete(event) {
      console.log("The transfer is complete.")
      // console.log('this.props = '+this.props)
    }
    
    function transferFailed(event) {
      console.log("An error occurred while transferring.")
    }
    
    function transferCanceled(event) {
      console.log("The transfer has been canceled by the user.")
    }
    this.setState({ xmlhttp: xmlhttp })
  }

  doLogin = () => {
    //Using axios
    const postData = JSON.stringify({
      login: 'test',
      password: '123456',
    })
    const requestConfig = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }
    console.log('start request...')
    // reqInstance.post('http://k8s.comismart.com/auth/rest/token', postData, requestConfig)
    // .then(response => {
    //   console.log('finish request.')
    //   return response.data
    // })
    // .then((json) => {
    //   console.log(json)
    //   this.setState({ login: true })
    // })
    // .catch((error) => {
    //   // Do something with the error object
    //   // If without this callback, you could probably get 'TypeError: failed to fetch' error when make request after a failed request
    //   console.log(error)
    // })

    //Using native XMLHttpRequest Object
    // const { xmlhttp } = this.state
    // xmlhttp.onload = (e) => {
    //   // console.log('this.readyState = '+this.sreadyState)
    //   // console.log('this.status = '+this.status)
    //   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //     console.log('request success!')
    //     console.log(xmlhttp.responseText)
    //     // document.getElementById("demo").innerHTML = this.responseText;
    //   } else if (xmlhttp.readyState == 4 && xmlhttp.status == 201) {
    //     console.log('request success and a new resource has been created!')
    //     // console.log(xmlhttp.responseText)
    //     var res = JSON.parse(xmlhttp.responseText)
    //     console.table(res)
    //     this.setState({ login: true })
    //     // document.getElementById("demo").innerHTML = this.responseText;
    //   }
    // }
    // // xmlhttp.open("GET", "http://flora.iro.ntnu.edu.tw/api/getReport/51", true)
    // // xmlhttp.send()

    // xmlhttp.open("POST", "http://k8s.comismart.com/auth/rest/token", true)
    // xmlhttp.setRequestHeader("Accept", "application/json")
    // xmlhttp.setRequestHeader("Content-type", "application/json")
    // xmlhttp.send(postData)

    //Using fetch method
    fetch("http://k8s.comismart.com/auth/rest/token", {
      method: 'POST', // or 'PUT'
      body: postData, // data can be `string` or {object}!
      headers: requestConfig.headers
    }).then(res => {
      // console.log(res)
      return res.json()
    })
    .then(response => {
      console.log('Success getting accessToken & refreshToken:', response)
      this.setState({ login: true })
      let myAccessToken = response.accessToken
      let myRefreshToken = response.refreshToken
      this.setState({ accessToken: myAccessToken, refreshToken: myRefreshToken })
      this.getDeviceInfoAndData(myAccessToken, myRefreshToken)
      // this.props.setTokens(myAccessToken, myRefreshToken)
      // requestConfig.headers.Authorization = 'Bearer ' + myAccessToken
      // console.table(requestConfig.headers)
      // fetch("http://k8s.comismart.com:80/api/rest/device/e50d6085-2aba-48e9-b1c3-73c673e414be", {
      //   method: 'GET', // or 'PUT'
      //   headers: requestConfig.headers
      // }).then(res => {
      //   // console.log(res)
      //   return res.json()
      // })
      // .then(device => {
      //   console.log('Success getting device info:', device)
      //   let info = 'Device Information'
      //   this.props.updateDeviceInfo(info, device)
      //   //Create a websocket and listening to server
      //   let mySocket = new WebSocket('ws://k8s.comismart.com/api/websocket')
      //   // console.log(mySocket)
      //   this.props.setWebsocket(mySocket)
      //   mySocket.onopen = function(e) {
      //     console.log('Connected to the websocket server')
      //     console.log(e.code)
      //     // console.log('myAccessToken = '+myAccessToken)
      //     let sendData = JSON.stringify({
      //       action: 'authenticate',
      //       token: myAccessToken,
      //     })
      //     mySocket.send(sendData)
      //     sendData = JSON.stringify({
      //       action: 'notification/subscribe',
      //       deviceId: device.id,
      //       names:  ['measurement'],
      //     })
      //     mySocket.send(sendData)
      //   }
      //   mySocket.onmessage = function(e) {
      //     console.log('Receiving message from the websocket server')
      //     let data = JSON.parse(e.data)
      //     // console.log(data)
      //     if (data.action.indexOf('insert') != -1) {
      //       console.log('Updating the measure data...')
      //       //Updating the measure data
      //       // this.props.updateMeasureData(data.notification)
      //     }
      //   }.bind(this) //Bind the Main class object to the closure
      //   mySocket.onclose = function(e) {
      //     console.log('Disconnected to the websocket server')
      //     console.log(e.code)
      //   }
      //   mySocket.onerror = function(e) {
      //     console.log('ERROR from the websocket server:')
      //     console.log(e.code)
      //   }
      // })
      // .catch(error => console.error('Error on getting device info:', error))
    })
    .catch(error => console.error('Error on getting accessToken & refreshToken:', error))
  }

  getLiveMeasureData = device => {
    //Create a websocket and listening to server
    let mySocket = new WebSocket('ws://k8s.comismart.com/api/websocket')
    // console.log(mySocket)
    this.props.setWebsocket(mySocket)
    mySocket.onopen = function(e) {
      console.log('Connected to the websocket server')
      console.log(e.code)
      // console.log('myAccessToken = '+myAccessToken)
      let sendData = JSON.stringify({
        action: 'authenticate',
        token: accessToken,
      })
      mySocket.send(sendData)
      sendData = JSON.stringify({
        action: 'notification/subscribe',
        deviceId: device.id,
        names:  ['measurement'],
      })
      mySocket.send(sendData)
    }
    mySocket.onmessage = function(e) {
      console.log('Receiving message from the websocket server')
      let data = JSON.parse(e.data)
      if (data.action.indexOf('insert') != -1) {
        console.log('Updating the measure data...')
        console.log(data)
        //Updating the measure data
        this.props.updateMeasureData(data.notification)
      }
    }.bind(this) //Bind the Main class object to the closure
    mySocket.onclose = function(e) {
      console.log('Disconnected to the websocket server')
      console.log(e.code)
    }
    mySocket.onerror = function(e) {
      console.log('ERROR from the websocket server:')
      console.log(e.code)
    }
  }

  getDeviceInfoAndData = (myAccessToken, myRefreshToken) => {
    let accessToken = myAccessToken ? myAccessToken : this.state.accessToken
    let refreshToken = myRefreshToken ? myRefreshToken : this.state.refreshToken
    let requestConfig = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
    }
    console.log('start request...')
    //Using fetch method
    fetch("http://k8s.comismart.com:80/api/rest/device/e50d6085-2aba-48e9-b1c3-73c673e414be", {
      method: 'GET', // or 'PUT'
      headers: requestConfig.headers
    }).then(res => {
      // console.log(res)
      return res.json()
    })
    .then(device => {
      console.log('Success getting device info:', device)
      this.setState({ stop: false })
      // let test = 401
      if (device.status == 401) {
        this.getRefershDeviceInfoAndData(refreshToken)
      } else {
        let info = 'Device Information'
        this.props.updateDeviceInfo(info, device)
        this.getLiveMeasureData(device)
      }
    })
    .catch(error => console.error('Error on getting device info:', error))
  }

  getRefershDeviceInfoAndData = (myRefreshToken) => {
    let postData = JSON.stringify({
      refreshToken: myRefreshToken,
    })
    let requestConfig = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }
    console.log('start request...')
    //Using fetch method
    fetch("http://k8s.comismart.com/auth/rest/token/refresh", {
      method: 'POST',
      body: postData,
      headers: requestConfig.headers
    }).then(res => {
      // console.log(res)
      return res.json()
    })
    .then(tokens => {
      console.log('Success getting refresh tokens:', tokens)
      let myAccessToken = tokens.accessToken
      requestConfig.headers.Authorization = 'Bearer ' + myAccessToken
      fetch("http://k8s.comismart.com:80/api/rest/device/e50d6085-2aba-48e9-b1c3-73c673e414be", {
        method: 'GET', // or 'PUT'
        headers: requestConfig.headers
      }).then(res => {
        // console.log(res)
        return res.json()
      })
      .then(device => {
        console.log('Success getting device info:', device)
        let info = 'Device Information'
        this.props.updateDeviceInfo(info, device)
        this.getLiveMeasureData(device)
      })
      .catch(error => console.error('Error on getting device info:', error))
    })
    .catch(error => console.error('Error on getting refresh tokens:', error))
  }

  doStop = () => {
    console.log('doStop...')
    let info = 'Press the RESUME to continue getting the device info and data, Thanks!'
    this.props.updateDeviceInfo(info, {})
    this.props.closeWebsocket()
    this.setState({ stop: true })
  }

  doLogout = () => {
    console.log('doLogout...')
    this.setState({ login: false })
    let info = 'Please login to get device info and data, Thanks!'
    this.props.updateDeviceInfo(info, {})
    this.props.clearMeasureData()
    this.props.closeWebsocket()
  }

  getControlBtn = (stop) => {
    if (stop) {
      return (
        <div>
          <Button color="inherit" onClick={this.getDeviceInfoAndData}>RESUME</Button>
        </div>
      )
    } else {
      return (
        <div>
          <Button color="inherit" onClick={this.doStop}>Stop</Button>
        </div>
      )
    }
  }

  render() {
    const { login, accessToken, refreshToken, stop } = this.state
    // console.log('refreshToken = ', refreshToken)
    let ctrlBtn = this.getControlBtn(stop)
    if (login) {
      return (
        <div>
          <div>
            <Button color="inherit" onClick={this.doLogout}>Logout</Button>
          </div>
          {ctrlBtn}
        </div>
      )
    }
    return (
      <Button color="inherit" onClick={this.doLogin}>Login</Button>
    )
  }
}