import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

export type WebsitesDailyUsage = Record<string, number>;
export type AppStore = Record<string, WebsitesDailyUsage> &
  Record<'test', number>;

export const useTimeStore = () => {
  const [store, setStore] = React.useState<AppStore>({} as AppStore);

  React.useEffect(() => {
    browser.storage.local.get().then((activity: Record<string, any>) => {
      setStore(activity);
    });
  }, []);

  return store;
};
