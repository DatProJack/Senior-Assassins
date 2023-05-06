import { useEffect, useState } from 'react';
import axios from 'axios';
import "./Leaderboard.css"

export default function Leaderboard() {
  
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios
      .get('https://backend.yaseenhalabi4.repl.co/students')
      .then((response) => {
        setLeaderboard(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  var count = 0;
  const leaderboardSpots = leaderboard.map((item, key) => {
    count++;
    var itemColor = item.alive? "alive" : "dead"
  
    return (
      <div key={key} className="leaderboardHeader pt-3">
        <div className="lh-item">#{count}</div>
        <div className="lh-item">{item.name}</div>
        <div className="lh-item">{item.roundKills}</div>
        <div className="lh-item">{item.totalKills}</div>
        <div className="lh-item"><span className={"status " + itemColor}></span></div>
      </div>
    );
  });

  return (
    <div className="">
      <div className="container mt-4">
        <div className="leaderboardHeader">
          <div className="lh-item"><strong>Rank</strong></div>
          <div className="lh-item"><strong>Name</strong></div>
          <div className="lh-item"><strong>Round Kills</strong></div>
          <div className="lh-item"><strong>Total Kills</strong></div>
          <div className="lh-item"><strong>Status</strong></div>
        </div>
        {leaderboardSpots}
      </div>
    </div>
    
  );
}