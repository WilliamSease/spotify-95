import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

type IProps = {
  effect: () => Promise<void>;
  condition?: boolean;
  delay: number;
};

export const useClock = (props: IProps) => {
  const { effect, condition = true, delay } = props;

  const effectCallback = useCallback(
    async (abortController: AbortController) => {
      if (!abortController.signal.aborted) {
        await effect();
        setTimeout(() => effectCallback(abortController), delay);
      }
    },
    [effect, delay]
  );

  useEffect(() => {
    let cancel = new AbortController();
    if (condition) {
      effectCallback(cancel);
    }
    return () => {
      cancel.abort();
    };
  }, [condition]);
};
