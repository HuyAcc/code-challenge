interface WalletBalance {
  currency: string;
  amount: number;

  // used below but missing in original type
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // simpler than switch
  const PRIORITY_MAP: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20
  };

  const getPriority = (blockchain: string) =>
    PRIORITY_MAP[blockchain] ?? -99;

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {

        // original code used undefined `lhsPriority`
        const balancePriority = getPriority(balance.blockchain);

        // keep only supported chains + positive balances
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {

        // comparator must always return number
        const left = getPriority(lhs.blockchain);
        const right = getPriority(rhs.blockchain);

        return right - left;
      });

    // `prices` removed (not used here)
  }, [balances]);

  const rows = sortedBalances.map((balance: WalletBalance) => {

    // avoid NaN if price missing
    const usdValue = (prices[balance.currency] ?? 0) * balance.amount;

    return (
      <WalletRow
        className={classes.row}

        // index key can break list updates
        key={`${balance.currency}-${balance.blockchain}`}

        amount={balance.amount}
        usdValue={usdValue}

        // original code created unused formattedBalances
        formattedAmount={balance.amount.toFixed(2)}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};