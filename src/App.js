import './App.css';
import { useEffect, useState } from 'react';

function App() {

  //=========================
  //STATE AND OTHER VARIABLES
  //=========================


  //endpoint of baseball-app API server
  // const endpoint = "http:///localhost:8080/players";
  const endpoint = "http://3.22.123.152:80/players";

  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedInfo, setSelectedInfo] = useState({
    name: "",
    city: "",
    height: "",
    weight: "",
    throws: "",
    bats: ""
  });

  //used to conditionally render form when new player is being created
  const [creationState, setCreationState] = useState(false);


  //======================
  //HTTP REQUEST FUNCTIONS
  //======================

  //use fetch to retreive all players with http GET request
  const getAllPlayers = async () => {
    let requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    let response = await fetch(endpoint, requestOptions);
    let data = await response.json();

    return data;
  };

  //use fetch to create player with http POST request
  const createPlayer = async () => {
    let requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: selectedInfo.name,
        city: selectedInfo.city,
        height: parseInt(selectedInfo.height, 10),
        weight: parseInt(selectedInfo.weight, 10),
        throws: selectedInfo.throws,
        bats: selectedInfo.bats
      })
    };

    let response = await fetch(endpoint, requestOptions);
    let data = await response.json();

    return data;
  };


  //use fetch to update player with http PUT request
  const updatePlayer = async () => {
    let requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: selectedInfo.name,
        city: selectedInfo.city,
        height: parseInt(selectedInfo.height, 10),
        weight: parseInt(selectedInfo.weight, 10),
        throws: selectedInfo.throws,
        bats: selectedInfo.bats
      })
    };

    let address = (endpoint + "/" + selectedPlayer);
    let response = await fetch(address, requestOptions);
    let data = await response.json();

    return data;
  };

  //use fetch to delete player with http DELETE request
  const deletePlayer = async () => {
    let requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };

    let address = (endpoint + "/" + selectedPlayer);
    let response = await fetch(address, requestOptions);
    let data = await response.json();

    return data;
  };


  //=============================
  //USE EFFECT AND MISC FUNCTIONS
  //=============================

  //run this code on page load
  useEffect(() => {

    //Call getAllPlayers and assign response to allPlayers state 
    getAllPlayers().then(response => {

      //store all players in state
      setAllPlayers(response);

      //select first player as default
      setSelectedInfo({
        name: response[0].name,
        city: response[0].city,
        height: response[0].height,
        weight: response[0].weight,
        throws: response[0].throws,
        bats: response[0].bats
      });
      setSelectedPlayer(response[0].name);
    });
  }, []);

  //function to refresh allPlayers after an update, creation, or delete
  const refreshAllPlayers = () => {
    getAllPlayers().then(response => {

      //store all players in state
      setAllPlayers(response);
    });
  };


  //=============
  //FORM HANDLERS
  //=============

  //dyanamically handle typed events in all input fields, values stored in selectedInfo
  const handleChange = (event) => {
    setSelectedInfo({ ...selectedInfo, [event.target.name]: event.target.value });
  };

  //select a player in selection drop down, displays their data in secondForm
  const handleFormOneSubmit = (event) => {

    //prevent form submission from refreshing page
    event.preventDefault();

    setSelectedPlayer(event.target.value);
    let selected = event.target.value;

    for (let player of allPlayers) {
      if (player.name === selected) {
        setSelectedInfo({
          name: player.name,
          city: player.city,
          height: player.height,
          weight: player.weight,
          throws: player.throws,
          bats: player.bats
        });
        break;
      }
    };
  };

  //handler for updating player
  const handleFormTwoUpdate = (event) => {
    updatePlayer().then(response => refreshAllPlayers());
  };


  //handler for deleting player, resets page to initial state on load after removal
  const handleFormTwoDelete = (event) => {
    deletePlayer().then(response => {
      getAllPlayers().then(response => {

        //store all players in state
        setAllPlayers(response);

        //select first player as default
        setSelectedInfo({
          name: response[0].name,
          city: response[0].city,
          height: response[0].height,
          weight: response[0].weight,
          throws: response[0].throws,
          bats: response[0].bats
        });
        setSelectedPlayer(response[0].name);
      });
    });
  };

  //handler for add player button in form two, starts the player creation process
  const handleFormTwoCreate = (event) => {
    setSelectedInfo({
      name: "",
      city: "",
      height: "",
      weight: "",
      throws: "",
      bats: ""
    });
    setCreationState(true);
  };

  //handler for backing out of player creation, resets form to previous values
  const handleFormTwoBack = (event) => {
    setCreationState(false);

    for (let player of allPlayers) {
      if (player.name === selectedPlayer) {
        setSelectedInfo({
          name: player.name,
          city: player.city,
          height: player.height,
          weight: player.weight,
          throws: player.throws,
          bats: player.bats
        });
      }
    }
  };

  //handler for submitting player creation
  const handleFormTwoSubmit = (event) => {
    createPlayer().then(response => {
      refreshAllPlayers();
      setCreationState(false);
      setSelectedPlayer(selectedInfo.name);
    });
  };


  //=============
  //PAGE CONTENTS
  //=============

  return (
    <div className="App">

      <h1>Player Management System</h1>

      <div className="totalForm">

        {/* FORM ONE */}
        <form className="firstForm">
          <label>
            <span id="firstFormTitle">Select a Player</span><br />
              <span id="firstFormText">
              Please select a baseball player to modify them in the database. You may create a new player or update/delete an existing player.
              </span>
          </label><br />
          <select id="firstFormSelect" disabled={creationState} name="player_select" value={selectedPlayer} onChange={(event) => handleFormOneSubmit(event)}>
            {allPlayers.map((player, i) =>
              <option key={i} value={player.name}> {player.name} </option>
            )}
          </select>
        </form>
        <br />

        {/* FORM TWO */}
        <form className="secondForm" action="index.php" method="post">
          <label className="formTwo" title="The player's name, up to 20 characters">
            <span>Player Name<span id="hints"> The players full name </span></span><br />
            <input className="playerInput" id="name" type="text" name="name" maxLength="20" required value={selectedInfo.name} onChange={(event) => handleChange(event)} />
          </label>
          <br />
          <label className="formTwo" title="The player's city, up to 20 characters">
            <span>Player City<span id="hints"> The player`s city of birth </span></span><br />
            <input className="playerInput" id="city" type="text" name="city" maxLength="20" required value={selectedInfo.city} onChange={(event) => handleChange(event)} />
          </label>
          <br />
          <label className="formTwo" title="The player's height from 1 to 108 inches">
            <span>Player Height<span id="hints"> Height up to 108 inches </span></span><br />
            <input className="playerInput" id="height" type="text" name="height" maxLength="3" required value={selectedInfo.height} onChange={(event) => handleChange(event)} />
          </label>
          <br />
          <label className="formTwo" title="The player's weight 1 to 1000 lbs">
            <span>Player Weight<span id="hints"> Weight up to 1000 lbs</span></span><br />
            <input className="playerInput" id="weight" type="text" name="weight" maxLength="3" required value={selectedInfo.weight} onChange={(event) => handleChange(event)} />
          </label>
          <br />
          <label className="formTwo" title="The player's batting stance as the letter R or L">
            <span>Batting Stance<span id="hints"> The letter R or L</span></span><br />
            <input className="playerInput" id="bats" type="text" name="bats" maxLength="1" required value={selectedInfo.bats} onChange={(event) => handleChange(event)} />
          </label>
          <br />
          <label className="formTwo" title="The player's throwing stance as the letter R or L">
            <span>Throwing Stance<span id="hints"> The letter R or L </span></span><br />
            <input className="playerInput" id="throws" type="text" name="throws" maxLength="1" required value={selectedInfo.throws} onChange={(event) => handleChange(event)} />
          </label>
          <br />

          {!creationState && <input className="formTwoLeftButtons" type="button" id="update" name="update_player" value="Update Player" onClick={(event) => handleFormTwoUpdate(event)} />}
          {!creationState && <input className="formTwoRightButtons" type="button" id="delete" name="delete_player" value="Delete Player" onClick={(event) => handleFormTwoDelete(event)} />}
          {!creationState && <input className="formTwoRightButtons" type="button" id="create" name="create_player" value="Add Player" onClick={(event) => handleFormTwoCreate(event)} />}

          {creationState && <input className="formTwoLeftButtons" type="button" id="cancel" name="cancel_create" value="Go Back" onClick={(event) => handleFormTwoBack(event)} />}
          {creationState && <input className="formTwoLeftButtons" type="button" id="submit" name="submit_create" value="Create" onClick={(event) => handleFormTwoSubmit(event)} />}

        </form>




      </div>

      <div id="disclaimer">
        This Baseball Player Management System is a CRUD application created and developed by <a href="https://www.linkedin.com/in/kurtis-miles-2271621a0/" target="new" title="Kurtis Miles">Kurtis Miles</a>. It is a full stack project built with MySQL, Express.js, Node.js, and React.js. All backend resources are built and hosted on the AWS Cloud.
        This includes an S3 bucket to serve static web content like this <a href="https://github.com/kurtismiles/Baseball_React_App" target="new" title="Github Link">React Frontend</a>, 
        an EC2 instance housing the <a href="https://github.com/kurtismiles/Baseball_API_Server" target="new" title="Github Link">RESTful API Server</a>, and an RDS database instance that contains the MySQL database in use by this application.     
      </div>

    </div>
  );
}

export default App;
