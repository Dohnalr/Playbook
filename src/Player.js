import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';

function Player({ id, initialPosition, playerName, selectedPlayer, onSelect, route }) {
  const [name, setName] = useState(playerName);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playerName);

  useEffect(() => {
    setName(playerName);
  }, [playerName]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e) => {
    setEditName(e.target.value.substring(0, 2).toUpperCase());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setName(editName);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setName(editName);
    setIsEditing(false);
  };

  const handleClick = () => {
    onSelect(id);
  };

  const isSelected = selectedPlayer === id;

  return (
    <Draggable>
      <g onDoubleClick={handleDoubleClick} onClick={handleClick} className="player">
        {/* Draw the route with arrow on the last line */}
        {route && route.map((point, index, arr) => {
          const isLastPoint = index === arr.length - 2; // Second last point in the array
          return (
            <line
              key={index}
              x1={point.x}
              y1={point.y}
              x2={arr[index + 1]?.x || point.x}
              y2={arr[index + 1]?.y || point.y}
              stroke="red"
              strokeWidth="2"
              markerEnd={isLastPoint ? "url(#arrowhead)" : ""}
            />
          );
        })}
        {/* Player representation */}
        <circle cx={initialPosition.x} cy={initialPosition.y} r="12" fill="whitesmoke" strokeWidth="2" stroke={isSelected ? "blue" : "black"} />
        {!isEditing ? (
          <text
            x={initialPosition.x}
            y={initialPosition.y}
            fontWeight="bold"
            fontSize="12"
            fill={isSelected ? "blue" : "black"}
            textAnchor="middle"
            alignmentBaseline="central"
            style={{ pointerEvents: 'none' }}
          >
            {name}
          </text>
        ) : (
          <foreignObject x={initialPosition.x - 14} y={initialPosition.y - 6} width="24" height="14">
            <input
              type="text"
              value={editName}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              style={{
                width: '24px',
                height: '14px',
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'center',
                border: 'none',
                outline: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0)'
              }}
              autoFocus
            />
          </foreignObject>
        )}
      </g>
    </Draggable>
  );
}

export default Player;
