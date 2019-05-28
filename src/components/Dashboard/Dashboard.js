import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import config from '../../config';
import moment from 'moment';
import TokenService from '../../services/token-service';

export default class Dashboard extends Component {
  state = {
    recentMatches: [],
    happy: ''
  }

  static contextType = UserContext;

  componentDidMount(){
    this.context.getSteamId()
      .then(() => {
        this.fetchRecentMatches();  
      });
    this.fetchMatchNotes();
  }

  fetchRecentMatches = () => {
    fetch(`${config.API_ENDPOINT}/proxy/${this.context.steamId}`)
      .then(res => res.json())
      .then(res => this.setState({recentMatches: res}));
  }

  fetchMatchNotes = () => {
    fetch(`${config.API_ENDPOINT}/match`, {
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      } 
    })
      .then(res => res.json())
      .then(res => console.log(res));
  }

  postMatchNotes = (match) => {
    fetch(`${config.API_ENDPOINT}/match`, {
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: {
        match_id: match.id,
        happy: match.happy,
        work: match.work,
        question: match.question,
        notes: match.notes
      }
    })
      .then(res => res.json())
      .then(res => console.log(res));  }


  updateHappyNotes = (event) => {
    this.setState({happy: event.target.value});
  }

  renderMatchHistory = () => {
    return (
      this.state.recentMatches.map((match, key) => 
        <div key={key} >
          <p>{this.context.heroes.find(hero => hero.id === match.hero_id).name}</p>
          <p>{moment.unix(match.start_time).format('MMMM Do YYYY, h:mm:ss a')}</p>
          <p>kdr: {match.kills}/{match.deaths}/{match.assists}</p>
          <p>{(match.player_slot <= 127 && match.radiant_win) || (match.player_slot >= 128 && ! match.radiant_win) ? 'win' : 'loss'}</p>
          <p>Match Id: {match.match_id}</p>
          <label>Happy<input type='text' onChange={(event) => this.updateHappyNotes(event)}></input>
          </label>
          <label>Work<input type='text'></input>
          </label>
          <label>Question<input type='text'></input>
          </label>
          <label>Notes<input type='text'></input>
          </label>
        </div>
      )
    );
  }

  render(){
    return (
      <div className='center columnCenter'>
        <button onClick={this.fetchRecentMatches}>Refresh recent Matches</button>
        {this.state.recentMatches ? this.renderMatchHistory() : null}
      </div>
    );
  }
}