export interface RoundDisplayProps {
  bookScore?: number;
  cardScore?: number;
  onScoreUpdate: (newValue: number) => void;
}

export const RoundDisplay = (props: RoundDisplayProps) => {
  const { bookScore, cardScore } = props;
  return (
    <div>
      <div>Book Score: {bookScore}</div>
      <div>Card Score: {cardScore}</div>
    </div>
  );
};
