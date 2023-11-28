import React, { useState, useEffect, useRef } from 'react';
import Player from './Player'; // Ensure this import is correct

function FootballField({ width, height }) {
  const [players, setPlayers] = useState([
    { id: 1, x: 400, y: 350, playerName: 'C' },
    { id: 2, x: 370, y: 350, playerName: 'LG' },
    // ... initial players
  ]);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [nextId, setNextId] = useState(3);

  // Drawing routes
  const [isDrawing, setIsDrawing] = useState(false);
  const [routes, setRoutes] = useState({});
  const svgRef = useRef(null);

  const handleSelectPlayer = (id) => {
    setSelectedPlayer(id);
  };

  const handleFieldClick = (e) => {
    // Check if the clicked element is not a player
    if (!e.target.closest('.player')) {
      setSelectedPlayer(null);
    }
  };

  useEffect(() => {
    // Add event listener to the whole document to handle clicks outside the players
    document.addEventListener('click', handleFieldClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleFieldClick);
    };
  }, []);

  const handleAddPlayer = () => {
    const newPlayer = {
      id: nextId,
      x: width * 0.5, // Default position for new player
      y: height * 0.5,
      playerName: ''
    };
    setPlayers([...players, newPlayer]);
    setNextId(nextId + 1);
  };

  const handleRemovePlayer = () => {
    setPlayers(players.filter(player => player.id !== selectedPlayer));
    setSelectedPlayer(null);
  };

  /* Drawing routes */
  const startDrawing = (player_id) => {
    setIsDrawing(true);
  //  setDrawingPlayer(player_id);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || selectedPlayer === null || !svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const newRoute = [
      ...(routes[selectedPlayer] || []),
      { x: e.clientX - svgRect.left, y: e.clientY - svgRect.top }
    ];
    setRoutes({ ...routes, [selectedPlayer]: newRoute });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const toggleDrawing = () => {
    if (selectedPlayer) {
      setIsDrawing(!isDrawing);
    }
  };

  return (
    <div>
      <svg width={width} height={height} style={{ backgroundColor: 'whitesmoke' }}
        //onClick={handleFieldClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}>
        {/* Insert PNG Image */}
        <image href={`${process.env.PUBLIC_URL}/greaypx.png`} x="0" y="0" width={width} height={height} />

        {/* Players */}
        {players.map(player => (
          <Player
            key={player.id}
            onClick={() => startDrawing(player.id)}
            id={player.id}
            initialPosition={player}
            playerName={player.playerName}
            selectedPlayer={selectedPlayer}
            onSelect={handleSelectPlayer}
            route={routes[player.id]} // Pass the route for each player
            className="player"
          />
        ))}

      </svg>
      <div style={controlBarStyle}>
        <button onClick={handleAddPlayer} style={buttonStyle}>Add Player</button>
        <button onClick={handleRemovePlayer} disabled={!selectedPlayer} style={buttonStyle}>Remove Selected Player</button>
        <button onClick={toggleDrawing} disabled={!selectedPlayer} style={buttonStyle}>{isDrawing ? 'Stop Drawing' : 'Draw Route'}</button>
      </div>
    </div>

  );
}


const controlBarStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: '#f2f2f2',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  marginTop: '10px'
};

const buttonStyle = {
  margin: '0 10px',
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};


export default FootballField;
