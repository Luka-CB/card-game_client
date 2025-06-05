import {
  HandBid,
  GameInfo,
  PlayingCard,
  RoomUser,
  HandWin,
} from "@/utils/interfaces";
import styles from "./Table.module.scss";
import BidModal from "../../gameControls/bidModal/BidModal";
import CardDeck from "../../gameControls/cardDeck/CardDeck";
import DrawnCards from "../../gameControls/drawnCards/DrawnCards";
import PlayedCards from "../../gameControls/playedCards/PlayedCards";

interface TableProps {
  gameInfo: GameInfo | null;
  user: { _id: string } | null;
  room: {
    users: RoomUser[];
    hisht: string;
    type: string;
  } | null;
  visibleCards: { [key: string]: PlayingCard[] };
  rotatedPlayers: RoomUser[];
  dealingCards?: Record<string, number>;
  isChoosingTrump?: boolean;
}

const Table: React.FC<TableProps> = ({
  gameInfo,
  user,
  room,
  visibleCards,
  rotatedPlayers,
  dealingCards,
  isChoosingTrump,
}) => {
  return (
    <div className={styles.table}>
      {gameInfo &&
        gameInfo?.status === "bid" &&
        gameInfo?.currentPlayerId === user?._id && (
          <BidModal
            rotatedPlayers={rotatedPlayers}
            data={{
              currentHand: gameInfo?.currentHand as number,
              roomId: gameInfo?.roomId,
              currentPlayerId: gameInfo?.currentPlayerId,
              dealerId: gameInfo?.dealerId as string,
              players: gameInfo?.players as string[],
              handBids: gameInfo?.handBids as HandBid[] | null,
              roomUsers: room?.users as RoomUser[],
              hands: gameInfo?.hands as
                | { hand: PlayingCard[]; playerId: string }[]
                | null,
              trumpCard: gameInfo?.trumpCard as PlayingCard | null,
            }}
          />
        )}
      <span className={styles.hisht}>Hisht: {room?.hisht}</span>
      <div className={styles.table_surface}>
        <PlayedCards
          playedCards={gameInfo?.playedCards || []}
          trumpCard={gameInfo?.trumpCard as PlayingCard}
          roomId={gameInfo?.roomId as string}
          currentHand={gameInfo?.currentHand as number}
          handCount={gameInfo?.handCount as number}
          HandWins={gameInfo?.handWins as HandWin[] | null}
          players={gameInfo?.players as string[]}
          dealerId={gameInfo?.dealerId as string}
          rotatedPlayers={rotatedPlayers}
        />
        <CardDeck gameInfo={gameInfo} />
        {rotatedPlayers.map((player, index) => (
          <DrawnCards
            key={player.id}
            drawnCards={visibleCards[player.id] || []}
            playerPositionIndex={index}
            playerId={player.id}
            user={user as { _id: string }}
            dealingCards={dealingCards || {}}
            gameInfo={{
              dealerId: gameInfo?.dealerId as string | null,
              status: gameInfo?.status as string,
              currentPlayerId: gameInfo?.currentPlayerId as string,
            }}
            isChoosingTrump={isChoosingTrump as boolean}
          />
        ))}
        <div className={styles.game_info}>
          <span className={styles.game_type}>{room?.type}</span>
        </div>
      </div>
    </div>
  );
};

export default Table;
