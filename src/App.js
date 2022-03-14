import React, { useState } from 'react';
import './App.css';

function App() {
  const [gameState, setGameState] = useState({
    isStart: false,
    cards: Array(16).fill(''),
    cardsStatus: Array(16).fill(''),// ura omote atariの状態を保つ
    isFirst: true,
    score1: 0,
    score2: 0,
    firstCardIndex: -1,
  })

  //カードが２枚押されたときに他を押せなくさせるフラグ
  const [diableCard, setDiableCard] = useState(false)

  //カードの配置を新しくする
  const getNewCards = () => {
    const cards = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H']
    for (let i = cards.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  //カードを配置するコンポーネント
  const Cards =  gameState.cards.map((value, index)=>{
    const status =  gameState.cardsStatus[index]

    if(status === 'ura'){
      return <button className='card' onClick={() => hadleClickCard(index,value)} key={index}>?</button>
    }
    if(status === 'omote'){
      return <button className='card' onClick={() => hadleClickCard(index,value)} key={index}>{value}</button>
    }
    if(status === 'atari'){
      return <button className='card' disabled onClick={() => hadleClickCard(index,value)} key={index}>{value}</button>
    }
    return <button className='card' key={index}>{value}</button>
  })

  //ゲーム開始時の初期化メソッド
  const gameStart = () => {
    const newCards = getNewCards()
    setGameState({
      isStart: true,
      cards: newCards,
      cardsStatus: Array(16).fill('ura'),
      isFirst: true,
      score1: 0,
      score2: 0,
      firstCardIndex: -1
    })
  }

  //秒数分待つ処理
  const wait = (sec) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  };

  //カードをクリックした時の処理
  const hadleClickCard = async (index, value) => {
    //１枚目と同じカードをクリックした時
    if(index === gameState.firstCardIndex){
      return
    }
    
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
    <div className={'cotainer'}>
      <div id="players">
        {
            !gameState.isStart ?
            (
              <>
                <div className='not-turn'>
                  <p>Player１</p>
                </div>
                <div className='not-turn'>
                  <p>Player２</p>
                </div>
              </>
            )
            :
            (
              <>
                <div className={gameState.isFirst ? 'turn': 'not-turn'}>
                  <p>Player１</p>
                  <p>{gameState.score1}点</p>
                </div>
                <div className={gameState.isFirst ? 'not-turn': 'turn'}>
                  <p>Player２</p>
                  <p>{gameState.score2}点</p>
                </div>
              </>
            )
        }
      </div>
      <div id="field">
        {Cards}
      </div>
      <button className='btn-gamestart' onClick={() => gameStart() }>GAME START</button>
    </div>
  );
}

export default App;
