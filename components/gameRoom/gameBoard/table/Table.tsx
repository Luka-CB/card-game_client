import {
  GameInfo,
  PlayingCard,
  RoomUser,
  ScoreBoard,
} from "@/utils/interfaces";
import styles from "./Table.module.scss";
import BidModal from "../../gameControls/bidModal/BidModal";
import CardDeck from "../../gameControls/cardDeck/CardDeck";
import DrawnCards from "../../gameControls/drawnCards/DrawnCards";

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
}

const Table: React.FC<TableProps> = ({
  gameInfo,
  user,
  room,
  visibleCards,
  rotatedPlayers,
  dealingCards,
}) => {
  return (
    <div className={styles.table}>
      {gameInfo &&
        gameInfo?.status === "bid" &&
        gameInfo?.activePlayerId === user?._id && (
          <BidModal
            data={{
              currentHand: gameInfo?.currentHand as number,
              roomId: gameInfo?.roomId,
              activePlayerId: gameInfo?.activePlayerId as string,
              activePlayerIndex: gameInfo?.activePlayerIndex as number,
              dealerId: gameInfo?.dealerId as string,
              players: gameInfo?.players as string[],
              scoreBoard: gameInfo?.scoreBoard as ScoreBoard[] | null,
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
        <CardDeck gameInfo={gameInfo} />
        {rotatedPlayers.map((player, index) => (
          <DrawnCards
            key={player.id}
            drawnCards={visibleCards[player.id] || []}
            playerPositionIndex={index}
            playerId={player.id}
            dealingCards={dealingCards || {}}
            gameInfo={{
              dealerId: gameInfo?.dealerId as string | null,
              status: gameInfo?.status as string,
            }}
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
