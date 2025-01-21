function Track({ track, onAdd, onRemove, isRemoval }) {
    if (!track) return null; // Guard clause to prevent rendering if track is undefined
  
    const handleClick = () => {
      if (isRemoval) {
        onRemove(track);
      } else {
        onAdd(track);
      }
    };
  
    return (
      <div className="Track">
        <h3>{track.name}</h3>
        <p>
          {track.artist} | {track.album}
        </p>
        <button onClick={handleClick}>{isRemoval ? "Remove" : "Add"}</button>
      </div>
    );
  }
  
  export default Track;
  