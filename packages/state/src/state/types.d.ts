type AppStore = WalletActions;

type SetStateType = (
  partial:
    | AppStore
    | Partial<AppStore>
    | ((state: AppStore) => AppStore | Partial<AppStore>),
  replace?: boolean | undefined
) => void;

type GetStateType = () => WalletActions;
