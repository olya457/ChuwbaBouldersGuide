import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SettingsStorage } from './SettingsStorage';

interface CollectionContextValue {
  collected: string[];
  visited: string[];
  stamps: string[];
  discoveriesSeen: string[];
  toggleCollect: (id: string) => void;
  markVisited: (id: string) => void;
  isCollected: (id: string) => boolean;
  isVisited: (id: string) => boolean;
  addStamp: (id: string) => void;
  markDiscoverySeen: (id: string) => void;
  loaded: boolean;
}

const CollectionContext = createContext<CollectionContextValue | undefined>(undefined);

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collected, setCollected] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>([]);
  const [stamps, setStamps] = useState<string[]>([]);
  const [discoveriesSeen, setDiscoveriesSeen] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, v, s, d] = await Promise.all([
        SettingsStorage.getCollection(),
        SettingsStorage.getVisited(),
        SettingsStorage.getEarnedStamps(),
        SettingsStorage.getDiscoveriesSeen(),
      ]);
      setCollected(c);
      setVisited(v);
      setStamps(s);
      setDiscoveriesSeen(d);
      setLoaded(true);
    })();
  }, []);

  const toggleCollect = useCallback((id: string) => {
    setCollected(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      SettingsStorage.setCollection(next);
      return next;
    });
  }, []);

  const markVisited = useCallback((id: string) => {
    setVisited(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      SettingsStorage.setVisited(next);
      return next;
    });
  }, []);

  const isCollected = useCallback((id: string) => collected.includes(id), [collected]);
  const isVisited = useCallback((id: string) => visited.includes(id), [visited]);

  const addStamp = useCallback((id: string) => {
    setStamps(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      SettingsStorage.setEarnedStamps(next);
      return next;
    });
  }, []);

  const markDiscoverySeen = useCallback((id: string) => {
    setDiscoveriesSeen(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      SettingsStorage.setDiscoveriesSeen(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      collected,
      visited,
      stamps,
      discoveriesSeen,
      toggleCollect,
      markVisited,
      isCollected,
      isVisited,
      addStamp,
      markDiscoverySeen,
      loaded,
    }),
    [collected, visited, stamps, discoveriesSeen, toggleCollect, markVisited, isCollected, isVisited, addStamp, markDiscoverySeen, loaded],
  );

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
};

export const useCollection = (): CollectionContextValue => {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error('useCollection must be used inside CollectionProvider');
  return ctx;
};