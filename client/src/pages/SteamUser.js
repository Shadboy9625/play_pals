import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';

const  SteamUser = () =>{
  const [steamId, setSteamId] = useState(null);
  const [appId, setAppId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [friendsInfo, setFriendsInfo] = useState([]);
  const [gamesInfo, setGamesInfo] = useState([]);
  const [appInfos, setAppInfos] = useState([]);
  const [numberOfGames, setNumberOfGames] = useState(0);
  
   useEffect(() => {
    const getSteamId = async () => {
      const response = await axios.get('http://localhost:8000/get-steam-id');
      setSteamId(response.data['Steam IDs'][1]);
    };
   
      getSteamId();
    }, []);

  useEffect(() => {
    const getFriends = async () => {
      if (steamId) {
        const response = await axios.get(`http://localhost:8000/get-friends/${steamId}`);
       
        setFriends(response.data['Friends']);
      }
    };
    
    getFriends();
  }, [steamId]);

  useEffect(() => {
    const getUserInfo = async () => {
      if (steamId) {
        const response = await axios.get(`http://localhost:8000/get-user-info/${steamId}`);
        setUserInfo(response.data);
      }
    };
    getUserInfo();
  }, [steamId]);
  
  useEffect(() => {
    const getNumberOfGames = async () => {
      if (steamId) {
        const response = await axios.get(`http://localhost:8000/get-number-of-games/${steamId}`);
        setNumberOfGames(response.data['Number of games']);
      }
    };
    getNumberOfGames();
  }, [steamId]);
  
    useEffect(() => {
    const getFriendsInfo = async () => {
    const response = await axios.get(`http://localhost:8000/get-friends/76561199040720807`);
      const friends = response.data['Friends'];
      
      const friendsInfo = await Promise.all(friends.map(async (friendId) => {
        const response = await axios.get(`http://localhost:8000/get-user-info/${friendId}`);
        return response.data;
      }));

      setFriendsInfo(friendsInfo);
    };

    getFriendsInfo();
  }, []);
  
  useEffect(() => {
    const getGamesInfo = async () => {
      if (steamId) {
        const response = await axios.get(`http://localhost:8000/get-games-info/${steamId}`);
        setGamesInfo(response.data['Games']);
      }
    };
    getGamesInfo();
  }, [steamId]);
  
  useEffect(() => {
    const getAppInfos = async () => {
      if (appId) {
        const response = await axios.get(`http://localhost:8000/get-app-info/${appId}`);
        setGamesInfo(response.data['Games']);
      }
    };
    getAppInfos();
  }, [appId]);
 

  
  return (
    <div>
      <h1>User Info</h1>
      <p>Person Name: {userInfo['Person Name']}</p>
      <img src={userInfo['Avatar Full']} alt="Avatar" />
      <h2>Total Number of Games: {numberOfGames}</h2>
      <h1>Friends</h1>
      <ul>
        {gamesInfo.map((game, index) => (
          <li key={index}>
            {appInfos.map((appInfo, index) => (
            <li key={index}>
              <p>Game Name: {appInfo['name']}</p>
            </li>
          ))}
            <p>Playtime Forever: {game['playtime_forever']}</p>
            
          </li>
        ))}
      </ul>
      <ul>
        {friendsInfo.map((friendInfo, index) => (
          <li key={index}>
            <p>Person Name: {friendInfo['Person Name']}</p>
            <img src={friendInfo['Avatar Full']} alt="Avatar" />
          </li>
        ))}
      </ul>
      
      <QRCode value="https://api.reclaimprotocol.org/api/sdk/verification-url/11ae7033-4c08-4202-8e0a-a7cce2536e83" />
    </div>
  );
}

export default SteamUser;