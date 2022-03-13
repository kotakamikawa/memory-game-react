import React, { useState } from 'react';

function App() {
  const [gameState, setGameState] = useState({
    isStart: false,
    cards: Array(16).fill(''),
    cardsStatus: Array(16).fill(''),// ura omote atari
    isFirst: true,
    score1: 0,
    score2: 0,
    firstCardIndex: -1,
  })

  const [diableCard, setDiableCard] = useState(false)

  const getNewCards = () => {
    const cards = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H']
    for (let i = cards.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  const Cards =  gameState.cards.map((value, index)=>{
    const status =  gameState.cardsStatus[index]

    if(status === 'ura'){
      return <button onClick={() => hadleClickCard(index,value)} key={index}>裏</button>
    }
    if(status === 'omote'){
      return <button onClick={() => hadleClickCard(index,value)} key={index}>{value}</button>
    }
    if(status === 'atari'){
      return <button disabled onClick={() => hadleClickCard(index,value)} key={index}>{value}</button>
    }
    return <button key={index}>{value}</button>
  })

  const gameStart = () => {
    const newCards = getNewCards()
    setGameState({
      isStart: false,
      cards: newCards,
      cardsStatus: Array(16).fill('ura'),
      isFirst: true,
      score1: 0,
      score2: 0,
      firstCardIndex: -1
    })
  }

  const wait = (sec) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  };

  const hadleClickCard = async (index, value) => {
    if(diableCard){
      return
    }

    const newCardsStatus = [...gameState.cardsStatus]
    const status = newCardsStatus[index]
    //裏を表にする
    if (status === 'ura') {
      newCardsStatus[index] = 'omote'
      setGameState({ ...gameState, cardsStatus: newCardsStatus })
    }
    
    const firstCardIndex = gameState.firstCardIndex
    //一手目の時
    if(firstCardIndex === -1){
      setGameState({ ...gameState, cardsStatus: newCardsStatus, firstCardIndex: index })
      return
    }

    //カードを見せる時間を作る
    setDiableCard(true)
    await wait(1.5)
    setDiableCard(false)

    //当たりの時
    if (firstCardIndex !== -1 && gameState.cards[firstCardIndex] === value) {
      newCardsStatus[firstCardIndex] = 'atari'
      newCardsStatus[index] = 'atari'
      setGameState({ ...gameState,
        cardsStatus: newCardsStatus,
        firstCardIndex: -1,
        score1: gameState.isFirst ? gameState.score1 + 1 : gameState.score1,
        score2: !gameState.isFirst ? gameState.score2 + 1 : gameState.score2,
      })
    }

    //ハズレの時
    if (firstCardIndex !== -1 && gameState.cards[firstCardIndex] !== value) {
      newCardsStatus[firstCardIndex] = 'ura'
      newCardsStatus[index] = 'ura'
      setGameState({ ...gameState, cardsStatus: newCardsStatus, firstCardIndex: -1, isFirst: !gameState.isFirst })
    }
  }
  
  return (
    <div>
      <p>{gameState.isFirst ? '◯ プレイヤー１': 'プレイヤー１'}：{gameState.score1}点</p>
      <p>{gameState.isFirst ? 'プレイヤー２': '◯ プレイヤー２'}：{gameState.score2}点</p>
      {Cards}
      <button onClick={() => gameStart() }>GAME START</button>
    </div>
  );
}

export default App;
