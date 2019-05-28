import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import config from '../../config';
import moment from 'moment';
import TokenService from '../../services/token-service';

export default class Dashboard extends Component {
  state = {
    notesComplete: false,
    matchesComplete: false,
    recentMatches: [],
    happy: '',
    matchNotes: {}
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
      .then(res => this.setState({recentMatches: res, matchesComplete: true}));
  }

  fetchMatchNotes = () => {
    fetch(`${config.API_ENDPOINT}/match`, {
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      } 
    })
      .then(res => res.json())
      .then(res => {
        const arr = res.map(match => {
          const result = {[match.match_id]: match};
          return result;
        });
        arr.forEach(match => {
          this.setState({matchNotes: {...this.state.matchNotes, ...match}, notesComplete: true});
        });
      });
  }

  postMatchNotes = (event, matchId) => {
    event.preventDefault();
    const match = this.state.matchNotes[matchId]
    fetch(`${config.API_ENDPOINT}/match`, {
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      method: 'POST',
      body: {
        match_id: matchId,
        happy: match.happy,
        work: match.work,
        question: match.question,
        notes: match.notes
      }
    })
      .then(res => res.json())
      .then(res => console.log(res));  
  }


  updateHappy = (event, matchId) => {
    this.setState({matchNotes: {...this.state.matchNotes, [matchId]: {...this.state.matchNotes[matchId], happy: `${event.target.value}`}}});
  }

  updateWork = (event, matchId) => {
    this.setState({matchNotes: {...this.state.matchNotes, [matchId]: {...this.state.matchNotes[matchId], work: `${event.target.value}`}}});
  }

  updateQuestion = (event, matchId) => {
    this.setState({matchNotes: {...this.state.matchNotes, [matchId]: {...this.state.matchNotes[matchId], question: `${event.target.value}`}}});
  }

  updateNotes = (event, matchId) => {
    this.setState({matchNotes: {...this.state.matchNotes, [matchId]: {...this.state.matchNotes[matchId], notes: `${event.target.value}`}}});
  }

  enableEditing = (matchId) => {
    const inputs = document.getElementsByClassName(`${matchId}-input`);
    for(let i = 0; i < inputs.length; i++){
      inputs[i].classList.remove('hidden');
    }

    const paragraphs = document.getElementsByClassName(`${matchId}-paragraph`);
    for(let i = 0; i < paragraphs.length; i++){
      paragraphs[i].classList.add('hidden');
    }
  }

  paragraphHasContent = (matchId, field) => {
    if(this.state.matchNotes[matchId] && this.state.matchNotes[matchId][field]){
      return 'hidden';
    }
  }

  renderMatchHistory = () => {
    return (
      this.state.recentMatches.map((match, key) => 
        <div key={key} className="matchInfo">
          <p>{this.context.heroes.find(hero => hero.id === match.hero_id).name}</p>
          <p>{moment.unix(match.start_time).format('MMMM Do YYYY, h:mm:ss a')}</p>
          <p>kdr: {match.kills}/{match.deaths}/{match.assists}</p>
          <p>{(match.player_slot <= 127 && match.radiant_win) || (match.player_slot >= 128 && ! match.radiant_win) ? 'win' : 'loss'}</p>
          <p>Match Id: {match.match_id}</p>
          <form className='match-feedback' onSubmit={(event, matchId) => this.postMatchNotes(event, match.match_id)}>
            <label>Happy
              <p className={`${match.match_id}-paragraph`}onClick={()=> this.enableEditing(match.match_id)}>{this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].happy : null}</p>
              <input type='text' onChange={(event, matchId) => this.updateHappy(event, match.match_id)} className={`${match.match_id}-input ${this.paragraphHasContent(match.match_id, 'happy')}`} value={this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].happy : ''}></input>
            </label>
            <br />
            <label>Work
              <p className={`${match.match_id}-paragraph`}>{this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].work : null}</p>
              <input type='text' onChange={(event, matchId) => this.updateWork(event, match.match_id)} className={`${match.match_id}-input ${this.paragraphHasContent(match.match_id, 'work')}`} value={this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].work : ''}></input>
            </label>
            <br />
            <label>Question
              <p className={`${match.match_id}-paragraph`}>{this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].question : null}</p>
              <input type='text' onChange={(event, matchId) => this.updateQuestion(event, match.match_id)} className={`${match.match_id}-input ${this.paragraphHasContent(match.match_id, 'question')}`} value={this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].question : ''}></input>
            </label>
            <br />
            <label>Notes
              <p className={`${match.match_id}-paragraph`}>{this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].notes : null}</p>
              <input type='text' onChange={(event, matchId) => this.updateNotes(event, match.match_id)} className={`${match.match_id}-input ${this.paragraphHasContent(match.match_id, 'notes')}`} value={this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].notes : ''}></input>
            </label>
            <button type='submit'>Submit</button>
            <button type='reset'>Cancel</button>
          </form>
        </div>
      )
    );
  }

  render(){
    return (
      <div className='center columnCenter'>
        <button onClick={this.fetchRecentMatches}>Refresh recent Matches</button>
        {this.state.recentMatches && this.state.notesComplete ? this.renderMatchHistory() : null}
      </div>
    );
  }
}