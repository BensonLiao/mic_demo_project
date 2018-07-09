import Snackbar from 'material-ui/Snackbar'

export default class Notify extends React.Component {
  state = {
    vertical: 'bottom',
    horizontal: 'right',
  }

  handleClose = () => {
    this.props.handleClose()
  }

  render() {
    const { vertical, horizontal } = this.state
    const { open, msg, notifyDuration } = this.props
    // console.log(this.props)
    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={notifyDuration} //in milliseconds
          onClose={this.handleClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{msg}</span>}
        />
      </div>
    )
  }
}