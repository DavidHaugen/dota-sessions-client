
export default class App extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    console.error(error)
    return { hasError: true }
  }

  render() {
    const { hasError } = this.state
    return (
      <div>
        <p>To access your match history, you'll need a key. Please visit this site to get your key: <a href='http://steamcommunity.com/dev/apikey'>Steam web API key</a></p>
      </div>
    );
  }
}


