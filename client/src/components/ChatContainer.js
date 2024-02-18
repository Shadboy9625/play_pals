import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";
import ChatDisplay from "./ChatDisplay";
import { useEffect, useState } from "react";
import axios from "axios";

const ChatContainer = ({ user }) => {
  const [clickedUser, setClickedUser] = useState(null);
  const [steamId, setSteamId] = useState(null);
  const [appId, setAppId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [friendsInfo, setFriendsInfo] = useState([]);
  const [gamesInfo, setGamesInfo] = useState([]);
  const [appInfos, setAppInfos] = useState([]);
  const [numberOfGames, setNumberOfGames] = useState(0);
  const [showFriends, setShowFriends] = useState(false);
  const [showGames, setGames] = useState(false);

  useEffect(() => {
    const getSteamId = async () => {
      const response = await axios.get("http://localhost:8000/get-steam-id");
      setSteamId(response.data["Steam IDs"][1]);
    };

    getSteamId();
  }, []);

  useEffect(() => {
    const getFriends = async () => {
      if (steamId) {
        const response = await axios.get(
          `http://localhost:8000/get-friends/${steamId}`
        );

        setFriends(response.data["Friends"]);
      }
    };

    getFriends();
  }, [steamId]);

  useEffect(() => {
    const getUserInfo = async () => {
      if (steamId) {
        const response = await axios.get(
          `http://localhost:8000/get-user-info/${steamId}`
        );
        setUserInfo(response.data);
      }
    };
    getUserInfo();
  }, [steamId]);

  useEffect(() => {
    const getNumberOfGames = async () => {
      if (steamId) {
        const response = await axios.get(
          `http://localhost:8000/get-number-of-games/${steamId}`
        );
        setNumberOfGames(response.data["Number of games"]);
      }
    };
    getNumberOfGames();
  }, [steamId]);

  useEffect(() => {
    const getFriendsInfo = async () => {
      const response = await axios.get(
        `http://localhost:8000/get-friends/76561199040720807`
      );
      const friends = response.data["Friends"];

      const friendsInfo = await Promise.all(
        friends.map(async (friendId) => {
          const response = await axios.get(
            `http://localhost:8000/get-user-info/${friendId}`
          );
          return response.data;
        })
      );

      setFriendsInfo(friendsInfo);
    };

    getFriendsInfo();
  }, []);

  useEffect(() => {
    const getGamesInfo = async () => {
      if (steamId) {
        const response = await axios.get(
          `http://localhost:8000/get-games-info/${steamId}`
        );
        setGamesInfo(response.data["Games"]);
      }
    };
    getGamesInfo();
  }, [steamId]);

  return (
    <div className="chat-container">
      <ChatHeader user={user} />

      <div>
        <button
          className="option"
          style={{ cursor: "pointer" }}
          onClick={() => setClickedUser(null)}
        >
          Matches
        </button>

        <button
          style={{ cursor: "pointer" }}
          onClick={() => setGames(!showGames)}
          className="option"
        >
          Show Games
        </button>

        {showGames && (
          <ul>
            <li>Game 1</li>
            <li>Game 2</li>
          </ul>
        )}

        <button
          className="option"
          onClick={() => setShowFriends(!showFriends)}
          style={{ cursor: "pointer" }}
        >
          Show Friends
        </button>

        {showFriends && (
          <ul>
            {friendsInfo.map((friendInfo, index) => (
              <li key={index}>
                <p>Person Name: {friendInfo["Person Name"]}</p>
                <img src={friendInfo["Avatar Full"]} alt="Avatar" />
              </li>
            ))}
          </ul>
        )}
      </div>

      {!clickedUser && (
        <MatchesDisplay
          matches={user.matches}
          setClickedUser={setClickedUser}
        />
      )}

      {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser} />}
    </div>
  );
};

export default ChatContainer;
